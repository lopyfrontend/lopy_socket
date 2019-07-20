import {FilterResult,Filter} from '../filter';


class Telnet extends Filter{
  filter(data) {

    let length = data.length;
    // let tail = data.slice(-2, length);
    //
    // if(tail[0] == 0x0d && tail[1] == 0x0a ) {
    //   let res = new TelnetResult();
    //   res.packageData = data;
    //   res.data = data.slice(0,-2);
    //   return res;
    // }
    for(let i=0;i<length;i++){
      if (data[i] == 0x0d) {
        if (typeof data[i + 1] != 'undefined' && data[i+1] == 0x0a) {
          let res = new TelnetResult();
          res.packageData = data.slice(0,i+2);
          res.data = data.slice(0,i);
          return res;
        }
      }
    }


    return false;
  }
}


class TelnetResult extends FilterResult{

}

export {TelnetResult,Telnet}