var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
// var expressJWT = require('express-jwt');

const EUM = require('./common/enumerate')
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var loginRouter = require('./routes/login');

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

// app.use(expressJWT({
//   secret: EUM.SECRET_KEY,
//   algorithms: ['HS256'],
// }).unless({
//   path: ['/', '/auth', '/auth/adminLogin', "/auth/login"]
// }))
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

  // render the error page
  res.status(err.status || 500);
  console.log(err)
  res.render('error');
});

module.exports = app;