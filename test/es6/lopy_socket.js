
import {Option,LopySocket} from "../../src";



describe('test lopy_socket',function () {
  it('constroter', function () {

    let option = Option.defaultOption();
    LopySocket.configureGlobal(option);
    let socketObj = LopySocket.create({length:2048});


    should.deepEqual(socketObj._option.length, 2048);

    //
  });

  it('test _plusReadPosition', function () {
    let socketObj = LopySocket.create({length:8});
    socketObj._plusReadPosition(2);
    should.equal(socketObj._dataReadPosition, 2);

    socketObj._plusReadPosition(3);
    should.equal(socketObj._dataReadPosition, 5);
    socketObj._plusReadPosition(4);
    should.equal(socketObj._dataReadPosition, 1);

  });

  it('pushData',function () {
    let socketObj = LopySocket.create({length:16});


    socketObj.onError(function (sender, e) {
      console.log(e);
    });

    let data = Buffer.from('');


    socketObj.push(data);


  });

  it('_currentData normal 1',function () {
    let socketObj = LopySocket.create({length:16});

    socketObj.onError(function (sender, e) {
      console.log(e);
    });

    let data = Buffer.from('abcdefghijkl');

    socketObj.push(data);
    should.deepEqual(socketObj._currentData, data);
    should.deepEqual(socketObj._dataReadPosition, 0);
    should.deepEqual(socketObj._dataWritePosition, data.length);


  });


  it('_currentData normal 2',function () {
    let socketObj = LopySocket.create({length:16});
    socketObj.onError(function (sender, e) {
      console.log(e);
    });

    let data = Buffer.from('abcdefghijkl');

    socketObj._dataWritePosition = 2;
    socketObj._dataReadPosition = 2;

    socketObj.push(data);

    should.deepEqual(socketObj._currentData, data);
    should.deepEqual(socketObj._dataReadPosition, 2);
    should.deepEqual(socketObj._dataWritePosition, 2 + data.length);


  });

  it('_currentData normal 3',function () {
    let socketObj = LopySocket.create({length:16});
    socketObj.onError(function (sender, e) {
      console.log(e);
    });

    let data = Buffer.from('abcdefghijkl');

    socketObj._dataWritePosition = 4;
    socketObj._dataReadPosition = 4;

    socketObj.push(data);

    should.deepEqual(socketObj._currentData, data);
    should.deepEqual(socketObj._dataReadPosition, 4);
    should.deepEqual(socketObj._dataWritePosition, 4 + data.length);


  });


  it('_currentData normal 4: beyond the max length of buffer zone',function () {
    let socketObj = LopySocket.create({length:16});
    socketObj.onError(function (sender, e) {
      console.log(e);
    });

    let data = Buffer.from('abcdefghijklabcdefghijkl');

    socketObj._dataWritePosition = 4;
    socketObj._dataReadPosition = 4;

    socketObj.push(data);

    should.deepEqual(socketObj._currentData, data);
    should.deepEqual(socketObj._dataReadPosition, 0);
    should.deepEqual(socketObj._dataWritePosition, data.length);


  });

  it('_currentData normal 5: beyond the max length of buffer zone',function () {
    let socketObj = LopySocket.create({length:16});
    socketObj.onError(function (sender, e) {
      console.log(e);
    });

    let data = Buffer.from('abcdefghijklabcdefghijkl');

    socketObj._dataWritePosition = 15;
    socketObj._dataReadPosition = 15;

    socketObj.push(data);

    should.deepEqual(socketObj._currentData, data);
    should.deepEqual(socketObj._dataReadPosition, 0);
    should.deepEqual(socketObj._dataWritePosition, data.length);


  });



  it('_currentData cycle 1',function () {
    let socketObj = LopySocket.create({length:16});
    socketObj.onError(function (sender, e) {
      console.log(e);
    });

    let data = Buffer.from('abcdefghijkl');
    socketObj._dataWritePosition = 6;
    socketObj._dataReadPosition = 6;

    socketObj.push(data);


    should.deepEqual(socketObj._currentData, data);
    should.deepEqual(socketObj._dataReadPosition, 6);
    should.deepEqual(socketObj._dataWritePosition, 6 + data.length - 16 );
  });

  it('_currentData cycle 2',function () {
    let socketObj = LopySocket.create({length:16});
    socketObj.onError(function (sender, e) {
      console.log(e);
    });

    let data = Buffer.from('abcdefghijkl');
    socketObj._dataWritePosition = 6;
    socketObj._dataReadPosition = 6;

    socketObj.push(data);


    should.deepEqual(socketObj._currentData, data);
    should.deepEqual(socketObj._dataReadPosition, 6);
    should.deepEqual(socketObj._dataWritePosition, 6 + data.length - 16 );
  });


  it('_currentData onData 1',function (done) {
    let testData = 'abcdef';
    let actual = null;
    let socketObj = LopySocket.create({length:16});
    socketObj.onError(function (sender, e) {
      console.log(e);
    });
    socketObj.onData(function (sender, data) {
      actual = data;
    });


    let data = Buffer.from(testData + "\r\n");

    socketObj.push(data);


    setTimeout(function () {
      should.deepEqual(actual, Buffer.from(testData));
      should.equal(1, 1);
      done();
    });

  });

  it('_currentData onData 2',function (done) {
    let testData = 'abcdef';
    let actual = null;
    let socketObj = LopySocket.create({length:16});
    socketObj.onError(function (sender, e) {
      console.log(e);
    });
    socketObj.onData(function (sender, data) {
      actual = data;
    });


    let data = Buffer.from(testData + "\r\naasdfas");

    socketObj.push(data);


    setTimeout(function () {
      should.deepEqual(actual, Buffer.from(testData));
      should.equal(1, 1);
      done();
    });

  });



  it('_currentData onData 3: multi data',function (done) {
    let testData = 'abcdef';
    let actualList = [];
    let socketObj = LopySocket.create({length:16});
    socketObj.onError(function (sender, e) {
      console.log(e);
    });
    socketObj.onData(function (sender, data) {
      actualList.push(data);
    });


    let data = Buffer.from(testData + "\r\n" + testData + "\r\n");

    socketObj.push(data);


    setTimeout(function () {
      should.equal(actualList.length, 2);

      actualList.forEach(function (v) {
        should.deepEqual(v, Buffer.from(testData));
      });

      should.equal(1, 1);
      done();
    });

  });


  it('_currentData onData 4: multi data 2',function (done) {
    let testData = 'abcdef';
    let actualList = [];
    let socketObj = LopySocket.create({length:16});
    socketObj.onError(function (sender, e) {
      console.log(e);
    });
    socketObj.onData(function (sender, data) {
      actualList.push(data);
    });


    let data = Buffer.from(testData + "\r\n" + testData + "\r\nasdfegadfe");

    socketObj.push(data);


    setTimeout(function () {
      should.equal(actualList.length, 2);

      done();
    });

  });


  it('_currentData onData 5: multi data 3',function (done) {
    let testData = 'abcdef';
    let actualList = [];
    let socketObj = LopySocket.create({length:16});
    socketObj.onError(function (sender, e) {
      console.log(e);
    });
    socketObj.onData(function (sender, data) {
      actualList.push(data);
    });


    let data = Buffer.from(testData + "\r\n" + testData + "\r\nasdfegadfe\r\n");

    socketObj.push(data);


    setTimeout(function () {
      should.equal(actualList.length, 3);

      done();
    });

  });


});