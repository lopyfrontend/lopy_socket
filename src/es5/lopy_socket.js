"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.LopySocket = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _option = require("./option");

var _events = require("events");

var _telnet = require("./filter/telnet");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var LopySocket = function () {
  _createClass(LopySocket, [{
    key: "setFilter",
    value: function setFilter(filter) {
      this._dataFilter = filter;
    }
  }, {
    key: "_bufferLength",
    set: function set(length) {
      this.__bufferLength = length;
    }

    /**
     *
     * @returns {number}
     * @private
     */
    ,
    get: function get() {
      if (this.__bufferLength > 0) {
        return this.__bufferLength;
      }
      return this._option.length > 0 ? this._option.length : 1024;
    }
  }, {
    key: "_bufferZoneMaxLength",
    get: function get() {
      return this._option.bufferZoneMaxLength > 0 ? this._option.bufferZoneMaxLength : 10240;
    }
  }, {
    key: "_dataMaxLength",
    get: function get() {
      return this._option.dataMaxLength > 0 ? this._option.dataMaxLength : 10240;
    }

    /**
     *
     * @type {number}
     * @private
     */

  }, {
    key: "dataFilter",
    get: function get() {
      if (null == this._dataFilter) {
        throw new Error('dataFilter must be set');
      }

      return this._dataFilter;
    }

    // 获取buffer可用的空间长度

  }, {
    key: "_availableLen",
    get: function get() {
      return this._bufferLength - this._currentLength;
    }
  }], [{
    key: "configureGlobal",


    /**
     * 暂时无用
     * @param option:Option
     */
    value: function configureGlobal(option) {
      this._optionGlobal = option;
    }
  }, {
    key: "create",
    value: function create(option) {
      option = option || {};

      var globalOption = Object.assign({}, this._optionGlobal);
      var newObj = _extends({}, globalOption, option);
      var optionObj = _option.Option.fromObject(newObj);

      var socket = new LopySocket(optionObj);

      socket.setFilter(new _telnet.Telnet());
      return socket;
    }

    /**
     * 不用
     */


    /**
     *
     * @type {number}
     * @private
     */

  }]);

  function LopySocket(option) {
    _classCallCheck(this, LopySocket);

    this._event = new _events.EventEmitter();
    this._dataWritePosition = 0;
    this._dataReadPosition = 0;
    this.__bufferLength = 0;
    this._buffer = [];
    this._currentLength = 0;
    this._dataFilter = null;


    if (option.length <= 0) {
      throw new Error('the length of option is not valid');
    }

    this._option = option;

    /**
     * buffer 初始化缓冲区
     */
    this._buffer = Buffer.alloc(option.length);
  }

  _createClass(LopySocket, [{
    key: "onData",
    value: function onData(callback) {
      this._event.on('data', callback);
    }
  }, {
    key: "onError",
    value: function onError(callback) {
      this._event.on('error', callback);
    }
  }, {
    key: "push",
    value: function push(data) {
      // console.log('收到数据');
      // console.log(data);

      if (data === undefined) {
        return;
      }

      var dataLength = data.length;

      if (dataLength > this._dataMaxLength || dataLength + this._currentLength > this._dataMaxLength) {
        var _msg = '数据长度限制，请跟据实际情况重新配置 dataMaxLength';
        return this._event.emit('error', this, new Error(_msg));
      }

      //要拷贝数据的起始位置
      var dataStart = 0;
      // 要拷贝数据的结束位置
      // 缓存剩余可用空间


      if (this._availableLen < dataLength) {
        //当前缓冲区总量不足

        if (dataLength > this._bufferZoneMaxLength) {
          return this._event.emit('error', this, new Error(msg));
        }

        var exLength = Math.ceil((this._currentLength + dataLength) / this._bufferLength) * this._bufferLength;

        var tempBuffer = Buffer.alloc(exLength);

        //_buffer.copy(tempBuffer);
        this._bufferLength = exLength;

        // 数据存储进行了循环利用空间，需要进行重新打包
        // 数据存储在buffer的尾部+头部的顺序
        if (this._dataWritePosition < this._dataReadPosition) {
          var dataTailLen = this._bufferLength - this._dataReadPosition;
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
        var bufferTailLength = this._bufferLength - this._dataWritePosition;
        if (bufferTailLength < 0) {
          var _msg2 = '程序有漏洞，bufferTailLength < 0';
          return this._event.emit('error', this, new Error(_msg2));
        }
        // 数据尾部位置
        var dataEndPosition = dataStart + bufferTailLength;
        data.copy(this._buffer, this._dataWritePosition, dataStart, dataEndPosition);

        this._dataWritePosition = 0;
        dataStart = dataEndPosition;

        // data剩余未拷贝进缓存的长度
        var dataCopyLenNormal = dataLength - bufferTailLength;

        data.copy(this._buffer, this._dataWritePosition, dataStart, dataStart + dataCopyLenNormal);
        // 记录数据长度
        this._currentLength += dataLength;
        // 记录buffer可写位置
        this._dataWritePosition += dataCopyLenNormal;
      } else {
        if (this._dataWritePosition > this._bufferLength) {
          var _msg3 = '程序有漏洞，dataWritePosition > bufferLength';
          return this._event.emit('error', this, new Error(_msg3));
        }

        data.copy(this._buffer, this._dataWritePosition, dataStart, dataStart + dataLength);
        // 记录数据长度
        this._currentLength += dataLength;
        // 记录buffer可写位置
        this._dataWritePosition += dataLength;
      }

      this.read();
    }
  }, {
    key: "_plusReadPosition",
    value: function _plusReadPosition(len) {
      if (this._bufferLength - this._dataReadPosition < len) {
        var firstPartLen = this._bufferLength - this._dataReadPosition;
        this._dataReadPosition = len - firstPartLen;
      } else {
        this._dataReadPosition += len;
      }
    }
  }, {
    key: "_plusWritePosition",
    value: function _plusWritePosition(len) {
      if (this._bufferLength - this._dataWritePosition < len) {
        var firstPartLen = this._bufferLength - this._dataWritePosition;
        this._dataWritePosition = len - firstPartLen;
      } else {
        this._dataWritePosition += len;
      }
    }
  }, {
    key: "read",
    value: function read() {

      while (true) {

        var data = this._currentData;

        //

        if (data.length == 0) {
          break;
        }

        try {

          var filterRes = this.dataFilter.filter(data);

          if (!filterRes) {
            break;
          }

          var dataLength = filterRes.packageLength;
          filterRes.packageData;

          //success

          this._event.emit('data', this, filterRes.data);
          this._currentLength -= dataLength;
          this._plusReadPosition(dataLength);

          continue;
        } catch (e) {
          //清空数据
          this._currentLength = 0;
          return this._event.emit('error', this, new Error(e.message));
        }
      }
    }
  }, {
    key: "_currentData",
    get: function get() {
      var length = this._currentLength;

      var buffer = new Buffer.alloc(length);

      var dataEndPosition = 0;

      if (this._dataReadPosition + length > this._bufferLength) {
        //第一部分
        dataEndPosition = this._bufferLength;

        //第二部分
        // 开始位置为第一部分的长度
        var startPosition = dataEndPosition - this._dataReadPosition;

        // 长度为差值
        var startLength = this._dataReadPosition + length - this._bufferLength;

        this._buffer.copy(buffer, startPosition, 0, startLength);
      } else {
        dataEndPosition = this._dataReadPosition + length;
      }

      this._buffer.copy(buffer, 0, this._dataReadPosition, dataEndPosition);

      return buffer;
    }
  }]);

  return LopySocket;
}();

exports.LopySocket = LopySocket;