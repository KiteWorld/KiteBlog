var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var expressJWT = require('express-jwt');


const EUM = require('./common/enumerate')
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var loginRouter = require('./routes/login');
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
  secret: EUM.SECRET_KEY,
  algorithms: ['HS256'], //express-jwt 6.0 需要添加加密方式
}).unless({
  path: ['/', '/auth', '/auth/adminLogin', "/auth/login"] //不需要token验证的请求
}))

//跨域
var mimeType = {
  'js': 'text/javascript',
  'html': 'text/html',
  'css': 'text/css'
}

app.all('*', function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', '*');
  res.header('Access-Control-Allow-Methods', '*');
  res.header('Content-Type', 'application/json;charset=utf-8');
  // res.header('Content-Type', 'video/mp4');
  // res.header('Content-Type', 'audio/mp3');
  // if (mimeType[req.url.split('.').pop()]) {
  //   console.log(req.url.split('.'))
  //   res.header('Content-Type', mimeType[req.url.split('.').pop()] + ';charset:UTF-8');
  // }
  next();
});
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/auth', loginRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});


// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);

  // if (err.inner.name === "TokenExpiredError") {
  //   jsonWrite(res, {
  //     code: 911, //call 911!
  //     msg: "token已失效，请重新登录账号"
  //   })
  // }
  if (err.name === "UnauthorizedError") {
    res.status(401)
    jsonWrite(res, {
      code: 911, //call 911!
      msg: err.message
    })
  }
  // render the error page

  res.render('error');
});

module.exports = app;