/**
 * Created by 38079 on 2018/3/12.
 */
// 用户购买某一关口
var express = require('express');
var router = express.Router();
var user = require('../src/dao/user/user');

/* GET home page. */
router.get('/', function(req, res, next) {
	console.log('run buyRound')
	user.buyRound(req.query, function (data) {
		res.json(data);
	});
});

module.exports = router;

