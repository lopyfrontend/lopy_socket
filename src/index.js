import {Option} from './option';
import {LopySocket} from "./lopy_socket";

import {Telnet,TelnetResult} from "./filter/telnet";


let filters = {
  telnet:{
    TelnetResult,
    Telnet
  }
};
export {Option,LopySocket,filters};
