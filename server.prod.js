'use strict';

var Nuxt = require('nuxt');
var app = require('express')();
var host = process.env.HOST || '192.168.1.132';
var port = process.env.PORT || 3002;
var proxy = require("express-http-proxy");
var cookieParser = require('cookie-parser');
var session = require('express-session');
var apiProxy = proxy("192.168.1.142", {
  forwardPath: function forwardPath(req, res) {
    return req._parsedUrl.path;
  }
});
// let httpService = require('./common/httpService.js')
var time = 0;

app.set('port', port);
// Import API Routes


app.use(cookieParser());
app.use("/front/*", apiProxy);
app.use('/api', require('./api/index'));
app.use(session({
  secret: 'yaocaimaimai', //secret的值建议使用随机字符串
  cookie: { maxAge: 60 * 1000 * 60 * 12 // 过期时间（毫秒）
  } }));

// httpService.commonGet('http://127.0.0.1:3000/front/system/date.do')
//     .then(function(res) {
//         let localTime = new Date().getTime();
//         time = res.biz_result.time - localTime;
//         console.log(time);
//     })
//     .catch(function(err) {
//         console.log(err);
//     })

// Import and Set Nuxt.js options
app.get('*', function (req, res, next) {
  req.headers.cookie = decodeURIComponent(req.headers.cookie);
  req.session.difTime = time;
  next();
});

var config = require('./nuxt.config.js');
config.dev = !(process.env.NODE_ENV === 'production');

// Init Nuxt.js
var nuxt = new Nuxt(config);
app.use(nuxt.render);

// Build only in dev mode
if (config.dev) {
  nuxt.build().catch(function (error) {
    console.error(error); // eslint-disable-line no-console
    process.exit(1);
  });
}
// Listen the server
app.listen(port, host);
console.log('Server listening on ' + host + ':' + port); // eslint-disable-line no-console
