var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var logger = require('morgan');
var expressJWT = require("express-jwt");
var { PRIVATE_KEY } = require("./config/constant");
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var goodsRouter = require('./routes/goods');

var app = express();
//设置跨域访问
app.all('*', (req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
  res.header("X-Powered-By",' 3.2.1')
  res.header("Content-Type", "application/json;charset=utf-8");
  next();
});
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({
  secret: 'keyboard cat',
  resave: true,
  saveUninitialized: false,
cookie:{//session是基于cookie的，所以可以在配置session的时候配置cookie|
  maxAge:1000*60,//设置过期时间
  secure:false//true的话表示只有https协议才能访问cookie
}
}))
app.use(express.static(path.join(__dirname, 'public')));
//拦截添加，要放在路由之前
// 前端token值格式 Bearer token
app.use(expressJWT({
	secret: PRIVATE_KEY,
	algorithms:['HS256']
}).unless({
	path: ['/users/register', '/users/login','/users/upload','/users/create_code','/users/verification_code'] //白名单,除了这了写的地址，其他的URL都需要验证
}));
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/goods', goodsRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
