import should from 'should';
import {Option} from "../../src/index";

describe('test optionGlobal', function () {
  it('optionGlobal instance', function () {
    let option = new Option();

    let length = 4;
    option.length = length;

    should.exist(option);
    should.strictEqual(option.length, length);
  });

  it('optionGlobal fromObject', function () {
    let obj = {
      length: 4,
      hello: 'world'
    };

    let option = Option.fromObject(obj);

    should.strictEqual(option.length, obj.length);

    should.not.exist(option.hello);

  });

  it('optionGlobal defaultOption',function () {
    let option = Option.defaultOption();
    should.exist(option);
    should.exist(option.length);
    should.equal(option.length,1024);


  })
});