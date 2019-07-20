'use strict';


try {
  console.log("> Note: Using ES6 version of lopy_socket");
  module.exports = require("./es6/index")
} catch (e) {

  console.log("> Note: Using ES5 version of lopy_socket");
  module.exports = require("./es5/index")
}