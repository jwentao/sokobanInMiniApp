let $get = obj => {
	wx.request({
		//获取openid接口
		url: 'http://apps.homed.me/payTest/miniapp/transRequest.php',
		data: obj.data,
		method:'GET',
		success:function(res){
			obj.success(res);
		}
	})
};

module.exports = {
	$get: $get
};
