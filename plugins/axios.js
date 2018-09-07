'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _axios = require('axios');

var _axios2 = _interopRequireDefault(_axios);

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

require('es6-promise').polyfill();
var options = {};
// The server-side needs a full url to works
if (process.SERVER_BUILD) {
  options.baseURL = 'http://' + (process.env.HOST || 'localhost') + ':' + (process.env.PORT || 3000);
}

exports.default = _axios2.default.create(options);
