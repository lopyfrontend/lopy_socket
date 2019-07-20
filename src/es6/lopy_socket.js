import {Option} from "./option";
import {EventEmitter} from 'events';
import {Telnet} from "./filter/telnet";

class LopySocket {


  static _optionGlobal;

  /**
   * 暂时无用
   * @param option:Option
   */
  static configureGlobal(option) {
    this._optionGlobal = option;
  }

  static create(option) {
    option = option || {};

    let globalOption = Object.assign({}, this._optionGlobal);
    let newObj = {...globalOption, ...option};
    let optionObj = Option.fromObject(newObj);

    let socket =  new LopySocket(optionObj);

    socket.setFilter(new Telnet());
    return socket;
  }


  /**
   * 不用
   */
  _option;

  _event = new EventEmitter();

  _dataWritePosition = 0;

  /**
   *
   * @type {number}
   * @private
   */
  _dataReadPosition = 0;

  __bufferLength = 0;
  set _bufferLength(length) {
    this.__bufferLength = length;
  }

  /**
   *
   * @returns {number}
   * @private
   */
  get _bufferLength() {
    if (this.__bufferLength > 0) {
      return this.__bufferLength
    }
    return this._option.length > 0 ? this._option.length : 1024;
  };

  get _bufferZoneMaxLength() {
    return this._option.bufferZoneMaxLength > 0 ? this._option.bufferZoneMaxLength : 10240;
  };

  get _dataMaxLength() {
    return this._option.dataMaxLength > 0 ? this._option.dataMaxLength : 10240
  }

  _buffer = [];

  /**
   *
   * @type {number}
   * @private
   */
  _currentLength = 0;


  _dataFilter = null;

  setFilter(filter) {
    this._dataFilter = filter;
  }

  get dataFilter() {
    if (null == this._dataFilter) {
      throw new Error('dataFilter must be set');
    }

    return this._dataFilter;
  }


  // 获取buffer可用的空间长度
  get _availableLen() {
    return this._bufferLength - this._currentLength;
  };


  constructor(option) {

    if (option.length <= 0) {
      throw new Error('the length of option is not valid');
    }

    this._option = option;

    /**
     * buffer 初始化缓冲区
     */
    this._buffer = Buffer.alloc(option.length);

  }

  onData(callback) {
    this._event.on('data', callback);
  }


  onError(callback) {
    this._event.on('error', callback);
  }

  push(data) {
    // console.log('收到数据');
    // console.log(data);

    if (data === undefined) {
      return;
    }

    let dataLength = data.length;

    if (dataLength > this._dataMaxLength || dataLength + this._currentLength > this._dataMaxLength) {
      let msg = '数据长度限制，请跟据实际情况重新配置 dataMaxLength';
      return this._event.emit('error', this, new Error(msg));
    }

    //要拷贝数据的起始位置
    let dataStart = 0;
    // 要拷贝数据的结束位置
    // 缓存剩余可用空间


    if (this._availableLen < dataLength) {
      //当前缓冲区总量不足

      if (dataLength > this._bufferZoneMaxLength) {
        return this._event.emit('error', this, new Error(msg));
      }

      let exLength = Math.ceil((this._currentLength + dataLength) / this._bufferLength) * this._bufferLength;

      let tempBuffer = Buffer.alloc(exLength);

      //_buffer.copy(tempBuffer);
      this._bufferLength = exLength;

      // 数据存储进行了循环利用空间，需要进行重新打包
      // 数据存储在buffer的尾部+头部的顺序
      if (this._dataWritePosition < this._dataReadPosition) {
        let dataTailLen = this._bufferLength - this._dataReadPosition;
        this._buffer.copy(tempBuffer, 0, this._dataReadPosition, this._dataReadPosition + dataTailLen);
        this._buffer.copy(tempBuffer, dataTailLen, 0, this._dataWritePosition);
      }
      // 数据是按照顺序进行的完整存储
      else {
        this._buffer.copy(tempBuffer, 0, this._dataReadPosition, this._dataWritePosition);
      }

      this._buffer = tempBuffer;
      tempBuffer = null;

      this._dataReadPosition = 0;
      this._dataWritePosition = this._currentLength;
      data.copy(this._buffer, this._dataWritePosition, dataStart, dataStart + dataLength);
      this._currentLength += dataLength;
      this._dataWritePosition += dataLength;

    } else if (this._dataWritePosition + dataLength > this._bufferLength) {
      //缓冲区尾部长度不足，需要分两截存储

      // buffer尾部剩余空间的长度
      let bufferTailLength = this._bufferLength - this._dataWritePosition;
      if (bufferTailLength < 0) {
        let msg = '程序有漏洞，bufferTailLength < 0';
        return this._event.emit('error', this, new Error(msg));
      }
      // 数据尾部位置
      let dataEndPosition = dataStart + bufferTailLength;
      data.copy(this._buffer, this._dataWritePosition, dataStart, dataEndPosition);

      this._dataWritePosition = 0;
      dataStart = dataEndPosition;

      // data剩余未拷贝进缓存的长度
      let dataCopyLenNormal = dataLength - bufferTailLength;

      data.copy(this._buffer, this._dataWritePosition, dataStart, dataStart + dataCopyLenNormal);
      // 记录数据长度
      this._currentLength += dataLength;
      // 记录buffer可写位置
      this._dataWritePosition += dataCopyLenNormal;
    } else {
      if (this._dataWritePosition > this._bufferLength) {
        let msg = '程序有漏洞，dataWritePosition > bufferLength';
        return this._event.emit('error', this, new Error(msg));
      }


      data.copy(this._buffer, this._dataWritePosition, dataStart, dataStart + dataLength);
      // 记录数据长度
      this._currentLength += dataLength;
      // 记录buffer可写位置
      this._dataWritePosition += dataLength;
    }


    this.read();
  }


  get _currentData() {
    let length = this._currentLength;


    let buffer = new Buffer.alloc(length);

    let dataEndPosition = 0;


    if (this._dataReadPosition + length > this._bufferLength) {
      //第一部分
      dataEndPosition = this._bufferLength;

      //第二部分
      // 开始位置为第一部分的长度
      let startPosition = dataEndPosition - this._dataReadPosition;

      // 长度为差值
      let startLength = this._dataReadPosition + length - this._bufferLength;

      this._buffer.copy(buffer, startPosition, 0, startLength);

    } else {
      dataEndPosition = this._dataReadPosition + length;
    }

    this._buffer.copy(buffer, 0, this._dataReadPosition, dataEndPosition);

    return buffer;
  }

  _plusReadPosition(len) {
    if (this._bufferLength - this._dataReadPosition < len) {
      let firstPartLen = this._bufferLength - this._dataReadPosition;
      this._dataReadPosition = len - firstPartLen;
    }
    else {
      this._dataReadPosition += len;
    }
  }

  _plusWritePosition(len) {
    if (this._bufferLength - this._dataWritePosition < len) {
      let firstPartLen = this._bufferLength - this._dataWritePosition;
      this._dataWritePosition = len - firstPartLen;
    }
    else {
      this._dataWritePosition += len;
    }
  }


  read() {

    while (true) {

      let data = this._currentData;

      //

      if (data.length == 0) {
        break;
      }

      try {

        let filterRes = this.dataFilter.filter(data);

        if (!filterRes) {
          break;
        }

        let dataLength = filterRes.packageLength;
        filterRes.packageData;


        //success

        this._event.emit('data', this, filterRes.data);
        this._currentLength -= dataLength;
        this._plusReadPosition(dataLength);

        continue;
      } catch (e) {
        //清空数据
        this._currentLength = 0 ;
        return this._event.emit('error', this, new Error(e.message));
      }

    }
  }

}

export {LopySocket}