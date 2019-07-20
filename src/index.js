'use strict';


try {
  module.exports = require("./es6/index");
  console.log("> Note: Using ES6 version of lopy_socket");
} catch (e) {

  module.exports = require("./es5/index");
  console.log("> Note: Using ES5 version of lopy_socket");
}