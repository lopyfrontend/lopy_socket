
const {filters} = require('../../src/');

/* 引入net模块 */
var net = require("net");

/* 创建TCP服务器 */
var server = net.createServer(function (socket) {
  console.log('someone connects');

  socket.on('data', function (v) {
    console.log('v');
    console.log(Buffer.from(v));

    let data = Buffer.from(v);
    let length = data.length;
    let tail = data.slice(-2, length);

    if(tail[0] == 0x0d && tail[1] == 0x0a ) {
      console.log(data.slice(0,-2));
    }


  });
});

/* 设置连接的服务器 */
server.listen(8000, function () {
  console.log("Creat server on http://127.0.0.1:8000/");
});

var a = new filters.Telnet.Telnet();


console.log(a);
