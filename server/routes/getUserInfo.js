// 获取用户信息
var express = require('express');
var router = express.Router();
var user = require('../src/dao/user/user');

/* GET home page. */
router.get('/', function(req, res, next) {
  console.log(req.query)
	user.query(req.query.openid, function (data) {
		res.json(data);
	});
});

module.exports = router;
