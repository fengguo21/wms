'use strict';
import http from './httpService.js'
import Vue from 'vue';
var _cryptoJs = require('crypto-js');
var _cryptoJs2 = _interopRequireDefault(_cryptoJs);
var cryptoJs = require('crypto-js')
function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
}
var axios = require('axios')
var api = new Vue({
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
        addCart(url, body, suc, err) {
            body.version = this.version;
            this.$http.post(url, body).then((response) => {
                suc(response);
            }, (response) => {
                err(response);
            });
        },
        getSID: function(req, redirect) {
            if (req) {
                var cookiesObj = {};
                var cookie = req.headers.cookie;
                cookie && cookie.split(';').forEach(function(Cookie) {
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
            } else {
                this.KEY = window.localStorage.KEY;
                this.SID = window.localStorage.SID;
            }
            if (!this.SID) {
                redirect('/login');
            }
        },
        getDate: function(cb) {
            var _self = this;
            if (_self.difTime && cb) {
                return cb();
            } else if (_self.difTime) {
                return;
            } else {
                this.commonGet(this.urlCommon + this.apiUrl.getDate).then(function(response) {
                    if (response.code == '1c01') {
                        var timestamp = Date.parse(new Date());
                        window.localStorage.difTime = response.biz_result.time - timestamp;
                        _self.difTime = response.biz_result.time - timestamp;
                        if (cb) cb();
                    } else {

                    }
                }, function(err) {

                });
            }
        },
        getSign: function(body) {
            var str = 'biz_module=' + body.biz_module + '&biz_method=' + body.biz_method + '&time=' + body.time
            var signStr = http.getSign(str)
            return signStr;
        },
        commonGet: function(url) {
            return new Promise(function(resolve, reject) {
                axios.get(url).then(function(response) {
                    resolve(response.data);
                }).catch(function(error) {
                    reject(error);
                });
            });
        },
        commonDelete: function(url) {
            return new Promise(function(resolve, reject) {
                axios.delete(url).then(function(response) {
                    resolve(response.data);
                }).catch(function(error) {
                    reject(error);
                });
            });
        },
        commonPut: function(url, body) {
            return new Promise(function(resolve, reject) {
                axios.put(url, body).then(function(response) {
                    resolve(response.data);
                }).catch(function(error) {
                    reject(error);
                });
            });
        },
         commonAxiosPost:function(url,data){
          return new Promise(function(resolve, reject) {
            axios.post(url, data, {
                      headers: {
                            'Content-Type': 'application/json;charset=UTF-8'
                      }
                  })
                  .then(function (response) {
                    console.log(response);
                    resolve(response.data);
                  })
                  .catch(function (error) {
                    console.log(error);
                    reject(error);
                  });
          });
      },
        commonPOST: function(body, url) {
            var _self = this
            url = url ? url : '/front/handle/control.do';
            body = this.commonBody(body)
            return new Promise(function(resolve, reject) {
                axios.post(_self.addSID(url), body).then(function(response) { //vue-resource无法抓取403错误，所以用axios
                    _self.getDate(); //获取时间戳
                    resolve(response.data);
                }).catch(function(error) {
                    if (error.response !== undefined && error.response !== '') {
                        if (error.response.status === 403) {
                            window.localStorage.KEY = '';
                            window.localStorage.SID = '';
                            _self.KEY = '';
                            _self.SID = '';
                            document.cookie = "no=;expires=";
                            document.cookie = "id=;expires=";
                            document.cookie = "orgId=;expires=";
                            document.cookie = "name=;expires=";
                            window.location.href = '/login';
                        };
                    };
                    reject(error);
                });
            })
        },
        //过滤掉不需要传值得字段
        filterFormData: function(params, filterKey) {
            if (params && typeof params == 'object') {
                var obj = {};
                for (var key in params) {
                    //如果键对应的值 是一个对象 递归
                    if (params[key] || params[key] === 0 || params[key] === false) {
                        //过滤掉不需要传值得字段
                        var flag = true;
                        if (filterKey !== undefined && filterKey instanceof Array) {
                            for (var i = 0; i < filterKey.length; i++) {
                                if (key === filterKey[i]) {
                                    flag = false;
                                    break;
                                }
                            }
                        }
                        if (flag) {
                            obj[key] = params[key];
                        }
                    }
                }
                return obj;
            } else {
                return params;
            }
        },
        mergeObj: function(obj1, obj2) {
            let obj = {};
            if (obj1 && typeof obj1 == 'object') {
                for (let k in obj1) {
                    if (obj1[k] != undefined && obj1[k] != '') {
                        obj[k] = obj1[k];
                    }
                }
            }
            if (obj2 && typeof obj2 == 'object') {
                for (let k in obj2) {
                    if (obj2[k] != undefined && obj2[k] != '') {
                        obj[k] = obj2[k];
                    }
                }
            }
            return obj;
        },
        commonBody: function(body) {
            body.time = Date.parse(new Date()) + parseInt(this.difTime),
                body.sign = this.getSign(body)
                body.version = 1
            return body
        },
        getCookie(name) {
            var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
            if (arr = document.cookie.match(reg)) {
                return unescape(arr[2]);
            } else {
                return '';
            }
        },
        setCookie(name, value) {
            var Days = 1;
            var exp = new Date();
            exp.setTime(exp.getTime() + Days * 24 * 60 * 60 * 1000);
            document.cookie = name + "=" + escape(value) + ";expires=" + exp.toGMTString() + "; path=/";
        }
    }
})

export default api;
