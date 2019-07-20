'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Telnet = exports.TelnetResult = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _filter = require('../filter');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Telnet = function (_Filter) {
  _inherits(Telnet, _Filter);

  function Telnet() {
    _classCallCheck(this, Telnet);

    return _possibleConstructorReturn(this, (Telnet.__proto__ || Object.getPrototypeOf(Telnet)).apply(this, arguments));
  }

  _createClass(Telnet, [{
    key: 'filter',
    value: function filter(data) {

      var length = data.length;
      // let tail = data.slice(-2, length);
      //
      // if(tail[0] == 0x0d && tail[1] == 0x0a ) {
      //   let res = new TelnetResult();
      //   res.packageData = data;
      //   res.data = data.slice(0,-2);
      //   return res;
      // }
      for (var i = 0; i < length; i++) {
        if (data[i] == 0x0d) {
          if (typeof data[i + 1] != 'undefined' && data[i + 1] == 0x0a) {
            var res = new TelnetResult();
            res.packageData = data.slice(0, i + 2);
            res.data = data.slice(0, i);
            return res;
          }
        }
      }

      return false;
    }
  }]);

  return Telnet;
}(_filter.Filter);

var TelnetResult = function (_FilterResult) {
  _inherits(TelnetResult, _FilterResult);

  function TelnetResult() {
    _classCallCheck(this, TelnetResult);

    return _possibleConstructorReturn(this, (TelnetResult.__proto__ || Object.getPrototypeOf(TelnetResult)).apply(this, arguments));
  }

  return TelnetResult;
}(_filter.FilterResult);

exports.TelnetResult = TelnetResult;
exports.Telnet = Telnet;