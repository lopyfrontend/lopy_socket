//import {Telnet,TelnetResult} from "../../src/dataFilter/telnet";
import {filters} from "../../src";

import should from 'should';

describe('test dataFilter telnet', function () {

  it('result', function () {
    let result = new filters.telnet.TelnetResult();


    should.exist(result.data);
    should.exist(result.packageData);
    should.exist(result.packageLength);

    should.equal(result.packageLength, result.packageData.length);
  });

  it('dataFilter normal',function () {
    let dataList = [
      {
        data:'aass'+"\r\n",
        expected: {
          res:true,
          data: 'aass'+"\r\n"
        }
      },
      {
        data:'aass',
        expected: {
          res:false,
          data:'',
        }
      }
    ];


    dataList.forEach(v => {


      let filter = new filters.telnet.Telnet();
      let buffer = Buffer.from(v.data);
      let res = filter.filter(buffer);

      should.equal(!res, !v.expected.res);

      if (v.expected.res) {
        should.deepEqual(res.packageData, Buffer.from(v.expected.data));
      }

    });
  });


  it('dataFilter one',function () {
    let dataList = [
      {
        data:'aass'+"\r\nasdf",
        expected: {
          res:true,
          data: 'aass'+"\r\n"
        }
      },

    ];


    dataList.forEach(v => {


      let filter = new filters.telnet.Telnet();
      let buffer = Buffer.from(v.data);
      let res = filter.filter(buffer);

      should.equal(!res, !v.expected.res);

      if (v.expected.res) {
        should.deepEqual(res.packageData, Buffer.from(v.expected.data));
      }

    });
  })
});