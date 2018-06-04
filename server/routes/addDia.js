// 增加钻石
var express = require('express');
var router = express.Router();
var user = require('../src/dao/user/user');

/* GET home page. */
router.get('/', function(req, res, next) {
	console.log('run adddia')
	user.addDia(req.query, function (data) {
		res.json(data);
	});
});

module.exports = router;

