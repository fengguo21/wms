'use strict';

var _axios = require('../plugins/axios');

var _axios2 = _interopRequireDefault(_axios);

var _vue = require('vue');

var _vue2 = _interopRequireDefault(_vue);

var _cryptoJs = require('crypto-js');

var _cryptoJs2 = _interopRequireDefault(_cryptoJs);

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
}

var httpService = new _vue2.default({
    data: {
        customerId: '',
        urlCommon: '/front',
        KEY: '',
        SID: '',
        menus: [],
        difTime: 0,
        apiUrl: {
            login: '/account/wmsLogin.do',
            code_login: '/account/verifiLogin.do',
            getDate: '/system/date.do',
            most: '/handle/control.do'
        }
    },
    methods: {
        addSID: function addSID(url) {
            if (this.SID && this.SID != undefined) {
                return url + ';jsessionid=' + this.SID;
            } else {
                this.KEY = window.localStorage.KEY;
                this.SID = window.localStorage.SID;
                return url + ';jsessionid=' + this.SID;
            }
        },
        getSID: function getSID(req) {
            var cookiesObj = {};
            var cookie = req.headers.cookie;
            this.difTime = req.session.difTime;
            cookie && cookie.split(';').forEach(function (Cookie) {
                function Trim(str) {
                    return str.replace(/(^\s*)|(\s*$)/g, "");
                }
                Cookie = Trim(Cookie);
                var parts = [];
                parts[0] = Cookie.substr(0, 3);
                parts[1] = Cookie.substr(4, Cookie.length);
                if (parts[1]) cookiesObj[parts[0].trim()] = (parts[1] || '').trim();
            });
            this.SID = cookiesObj.SID;
            this.KEY = cookiesObj.KEY;
        },
        getDate: function getDate(cb) {
            var _self = this;
            this.commonGet(this.urlCommon + this.apiUrl.getDate).then(function (response) {
                if (response.code == '1c01') {
                    var timestamp = Date.parse(new Date());
                    window.localStorage.difTime = response.biz_result.time - timestamp;
                    _self.difTime = window.localStorage.difTime;
                    if (cb) cb();
                } else {
                    _self.$message({
                        showClose: true,
                        message: response.msg,
                        type: 'error'
                    });
                }
            }, function (err) {
                _self.$message({
                    showClose: true,
                    message: '网络错误，请稍后重试',
                    type: 'error'
                });
            });
        },
        getSign: function getSign(str) {
            var _self = this;
            if (!_self.KEY) {
                _self.KEY = 'test';
            }
            if (!str) {
                str = 'test';
            }
            var signStr = _cryptoJs2.default.HmacSHA1(str, _self.KEY).toString(_cryptoJs2.default.enc.Base64);
            return signStr;
        },
        commonPost: function commonPost(url, data) {
            var _self = this;
            return new Promise(function (resolve, reject) {
                _axios2.default.post(url, data).then(function (response) {
                    if (response.data.code === '1c01' || response.data.code === 200) {
                        resolve(response.data);
                    } else {
                        _self.$message({
                            showClose: true,
                            message: response.data.msg,
                            type: 'error'
                        });
                        reject(response.data);
                    }
                }).catch(function (error) {
                    if (error.response.status === 403) {
                        window.localStorage.KEY = '';
                        window.localStorage.SID = '';
                        _self.KEY = '';
                        _self.SID = '';
                        window.location.href = '/login';
                    } else {
                        console.log(error);
                        reject(error);
                        _self.$message({
                            type: 'info',
                            message: '操作失败'
                        });
                    };
                });
            });
        },

        commonGet: function commonGet(url) {
            return new Promise(function (resolve, reject) {
                _axios2.default.get(url).then(function (response) {
                    resolve(response.data);
                }).catch(function (error) {
                    console.log(error);
                    reject(error);
                });
            });
        }
    }
});
module.exports = httpService;
