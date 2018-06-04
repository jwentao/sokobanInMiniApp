// 获取openid
var express = require('express');
var router = express.Router();
var request = require('request');
var qs = require('querystring');

/* GET home page. */
router.get('/', function(req, res, next) {
	console.log(req.query)
	if (!req.query.code) {
		res.json({
			msg: 'failed, no code',
			data: {}
		});
	} else {
		var data = qs.stringify({
			appid: 'wx068b690439a77218',
			secret: 'e8fd5384c8f3de63d4b1c492c31ab02f',
			js_code: req.query.code,
			grant_type:'authorization_code'
		});
		console.log(data)
		request({
			url: 'https://api.weixin.qq.com/sns/jscode2session?' + data
		}, function (error, response, body) {
			if (!error && response.statusCode == 200) {
				console.log(body)
				res.json({
					msg: 'success',
					data: JSON.parse(body)
				});
			}
		});
	}
});

module.exports = router;

