var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var expressJWT = require('express-jwt');

require('./config/global') // 根据不同环境设置通用配置

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var loginRouter = require('./routes/login');
var categoryRouter = require('./routes/category');
var articleRouter = require('./routes/article');
var hotPointRouter = require('./routes/hotPoint');
var viewRouter = require('./routes/router');
var uploadRouter = require('./routes/upload');
const {
  jsonWrite
} = require('./common/common');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({
  extended: false
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(expressJWT({
  secret: global.servers.SECRET_KEY,
  algorithms: ['HS256'], //express-jwt 6.0 需要添加加密方式
}).unless({
  path: ['/', '/auth', '/auth/adminLogin', "/auth/login", /^\/public\/.*/] //不需要token验证的请求
}))


var mimeType = {
  'js': 'text/javascript',
  'html': 'text/html',
  'css': 'text/css',
  'jpg': 'image/jpeg',
  'png': 'image/png',
}
//跨域
app.all('*', function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', '*');
  res.header('Access-Control-Allow-Methods', '*');
  res.header('Content-Type', 'application/json;charset=utf-8');
  if (mimeType[req.url.split('.').pop()]) {
    console.log(req.url.split('.'))
    res.header('Content-Type', mimeType[req.url.split('.').pop()] + ';charset:UTF-8');
  }
  next();
});

//根据不同的文件类型，设置不同 MIME 
app.use('/public', function (req, res, next) {
  const fileSuffix = ['.mp4', '.mp3', '.jpg', '.png']
  const fileIndex = fileSuffix.findIndex(suffix => {
    return req.url.indexOf(suffix + '?') !== -1
  })
  if (fileIndex || fileIndex === 0) {
    let noParamsUrl = req.url.split('?').shift();
    noParamsUrl.split('.').pop() === fileSuffix[fileIndex]
    res.header('Content-Type', mimeType[fileSuffix[fileIndex]])
  }
  next();
});

app.use('/public', express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/auth', loginRouter);
app.use('/category', categoryRouter);
app.use('/article', articleRouter);
app.use('/hotPoint', hotPointRouter);
app.use('/router', viewRouter);
app.use('/upload', uploadRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});


// error handler
app.use(function (err, req, res, next) {
  console.log(err)
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  if (err.status === 401) {
    jsonWrite(res, {
      code: 911, //call 911!
      msg: err.message
    })
  }
  res.render('error');
});

module.exports = app;