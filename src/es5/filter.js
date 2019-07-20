'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.FilterResult = exports.Filter = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _telnet = require('./filter/telnet');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Filter = function () {
  function Filter() {
    _classCallCheck(this, Filter);
  }

  _createClass(Filter, [{
    key: 'filter',


    /**
     * @throws Error 抛出异常，会清理当前的数据
     * @returns {boolean}
     */
    value: function filter(data) {
      if (1 == 2) {
        throw new Error('err');
      }
      return true;
    }
  }]);

  return Filter;
}();

var FilterResult = function () {
  function FilterResult() {
    _classCallCheck(this, FilterResult);

    this.packageData = Buffer.from('');
    this.data = {};
  }

  _createClass(FilterResult, [{
    key: 'packageLength',

    //data must
    /**
     * 一个完整的package的长度
     */

    /**
     * others ......
     */
    get: function get() {
      return this.packageData.length;
    }

    /**
     * 一个完整的package的数据,required
     */


    /**
     * 这是最终结果，会返回给onData回调的数据中，required
     */

  }]);

  return FilterResult;
}();

exports.Filter = Filter;
exports.FilterResult = FilterResult;