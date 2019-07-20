"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Option = function () {
  function Option() {
    _classCallCheck(this, Option);

    this.length = 0;
    this.bufferZoneMaxLength = 1024 * 1024;
    this.dataMaxLength = 1024 * 512;
  }

  _createClass(Option, null, [{
    key: "fromObject",
    value: function fromObject(object) {
      var option = new Option();

      Object.keys(option).forEach(function (v) {
        if (typeof object[v] == "undefined") {
          return;
        }

        option[v] = object[v];
      });

      return option;
    }
  }, {
    key: "defaultOption",
    value: function defaultOption() {
      return Option.fromObject({
        length: 1024
      });
    }
  }]);

  return Option;
}();

exports.Option = Option;