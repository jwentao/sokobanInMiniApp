//app.js
const tools = require('./utils/tools.js');
App({
  onLaunch: function () {
  	let that = this;
		wx.getStorage({
			key: 'openid',
			success(res) {
			},
			complete(res) {
				// 无缓存信息，请求openid
				if (res.errMsg === 'getStorage:fail data not found' || !res.data) {
					wx.login({
						success:function(loginRes){
							console.log(loginRes);
							tools.$get({
								//获取openid接口
								data:{
									url: '/user/get_openid',
									code: loginRes.code
								},
								success:function(getRes){
									console.log(getRes.data);
									if (getRes.data.msg === 'success' && getRes.data.data.openid) {
										console.log(getRes.data.data.openid)
										that.globalData.openid = getRes.data.data.openid;
										that.getUserInfo(getRes.data.data.openid);
										wx.setStorage({
										  key: 'openid',
										  data: getRes.data.data.openid,
											success: function () {
												console.log('缓存openid成功')
											}
										});
									}
								}
							})
						}
					})
				} else { // 有缓存信息，直接取
					that.globalData.openid = res.data;
					that.getUserInfo(res.data);
				}
			}
		});
		try {
			let value = wx.getStorageSync('audioCtrlOption')
			if (value) {
				// Do something with return value
				this.globalData.audioCtrlOption = value;
			}
		} catch (e) {
			console.log(e)
			// Do something when catch error
		}
	},
	getUserInfo(openid) {
  	let that = this;
		tools.$get({
			data:{
				url: '/user/get_info',
				openid: openid
			},
			success:function(getRes){
				console.log('userinfo', getRes.data);
				let data = getRes.data;
				if (data.msg !== 'success') {
					that.addUser(openid);
				} else {
					that.globalData.gameInfo = data.data;
					console.log(that.globalData.gameInfo)
				}
			}
		})
	},
	addUser(openid) {
  	let roundInfo = [{
			star: 0,
			step: NaN,
			isBuy: true
		}];
		this.globalData.gameInfo = {
			roundinfo: roundInfo,
			diamonds: 0,
			rechargeinfo: null,
			isBuy: true
		};
		console.log(this.globalData.gameInfo)
		tools.$get({
			data:{
				url: '/user/add_user',
				openid: openid,
				roundinfo: roundInfo
			},
			success:function(getRes){
				console.log('userinfo', getRes.data);
				let data = getRes.data;
				if (data.msg !== 'success') {

				}
			}
		})
	},
	globalData: {
  	openid: null,
		gameInfo: null, // 游戏信息
		bgmContext: null, // 背景音乐的上下文
		audioCtrlOption: {
  		bgm: {
  			name: '游戏背景音乐',
				isPlay: false
			},
			step: {
				name: '移动音效',
				isPlay: false
			},
			passed: {
				name: '过关音效',
				isPlay: false
			}
		}
	}
});