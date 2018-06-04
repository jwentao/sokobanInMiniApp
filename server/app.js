var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var getUserInfo = require('./routes/getUserInfo');
var addUser = require('./routes/addUser');
var getOpenID = require('./routes/getOpenID');
var updatePassed = require('./routes/updatePassed');
var updateDia = require('./routes/updateDia');
var buySolution = require('./routes/buySolution');
var buyRound = require('./routes/buyRound');
var addDia = require('./routes/addDia');

var app = express();
// 解决跨域问题
app.all('*', function(req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "X-Requested-With");
	res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
	res.header("X-Powered-By",' 3.2.1')
	res.header("Content-Type", "application/json;charset=utf-8");
	next();
});
// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/user/get_info', getUserInfo);
app.use('/user/add_user', addUser);
app.use('/user/get_openid', getOpenID);
app.use('/user/update_passed', updatePassed);
app.use('/user/update_dia', updateDia);
app.use('/user/buy_solution', buySolution);
app.use('/user/buy_round', buyRound);
app.use('/user/add_dia', addDia);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
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
