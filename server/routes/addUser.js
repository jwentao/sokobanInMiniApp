// 增加一个用户
var express = require('express');
var router = express.Router();
var user = require('../src/dao/user/user');

/* GET home page. */
router.get('/', function(req, res, next) {
	console.log('run adduser')
	user.add(req.query, function (data) {
		res.json(data);
	});
});

module.exports = router;

