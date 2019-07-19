import {TelnetResult,Telnet} from "./filter/telnet";

class Filter {




  /**
   * @throws Error 抛出异常，会清理当前的数据
   * @returns {boolean}
   */
  filter(data){
    if (1 == 2) {
      throw new Error('err');
    }
    return true;
  }

}

class FilterResult {
  //data must
  /**
   * 一个完整的package的长度
   */
  get packageLength(){
    return this.packageData.length;
  }


  /**
   * 一个完整的package的数据,required
   */
  packageData = Buffer.from('');


  /**
   * 这是最终结果，会返回给onData回调的数据中，required
   */
  data;
  /**
   * others ......
   */
}


export {Filter, FilterResult};