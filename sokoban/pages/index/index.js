// pages/channel/channel.js
const rounds = require('../../utils/rounds.js');
const tools = require('../../utils/tools.js');
const app = getApp();
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		roundArr: [], // 所有的关口
		roundInfo: [],
		starCount: 0, // 获得星星数
		diamondsCount: 0, // 剩余钻石数
		loadRoundInfoIndex: 0, // 从服务器获取关口信息计时，1 = 200ms
		audioCtrlOption: {} // 接收音量控制的参数
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function () {
		console.log('index load')
		this.loadRoundInfo();
		let roundInfo = [{
			star: 3
		}];
		// 读取本地的关口数据
		this.setData({
			roundArr: rounds.rounds
		});
		this.initBgm();
		this.data.audioCtrl = this.selectComponent("#audioCtrl");
		this.data.recharge = this.selectComponent("#recharge");
	},
	// 打开音效控制器
	showCtrl() {
		this.data.audioCtrl.setData({
			option: app.globalData.audioCtrlOption
		});
		this.data.audioCtrl.showCtrl();
	},
	// 打开充值面板
	openRechargeBar() {
		this.data.recharge.showRechargeBar(this);
	},
	initBgm() {
		this.data.innerAudioContextBgm = wx.createInnerAudioContext();
		this.data.innerAudioContextBgm.src = 'http://apps.homed.me/payTest/bgm.mp3';
		this.data.innerAudioContextBgm.loop = true;
		console.log(this.data.innerAudioContextBgm)
		if (app.globalData.audioCtrlOption.bgm.isPlay) {
			this.data.innerAudioContextBgm.play();
		}
		app.globalData.bgmContext = this.data.innerAudioContextBgm;
		console.log('app.globalData.bgmContext', app.globalData.bgmContext)
		this.data.innerAudioContextBgm.onPlay(() => {
			console.log('开始播放')
		});
		this.data.innerAudioContextBgm.onError((res) => {
			console.log(res.errMsg);
			console.log(res.errCode);
		});
	},
	toRound(e) {
		if (parseInt(e.currentTarget.dataset.round) < this.data.roundInfo.length) {
			wx.navigateTo({
				url: '../sokoban/sokoban?round=' + e.currentTarget.dataset.round
			});
		} else if (parseInt(e.currentTarget.dataset.round) === this.data.roundInfo.length){ // 购买
			console.log('goumai')
			let that = this;
			if (this.data.diamondsCount >= 5) {
				console.log('enougn diamonds')
				wx.showModal({
					title: '提示',
					content: '上一关还没过关哦，花费5颗钻石来购买这一关?',
					success:function (eConfirm) {
						if (eConfirm.confirm) {
							// 扣钻石的逻辑
							tools.$get({
								data:{
									url: '/user/buy_round',
									openid: app.globalData.openid,
									round: e.currentTarget.dataset.round
								},
								success:function(getRes){
									console.log(getRes)
									app.globalData.gameInfo = getRes.data.data;
									that.setData({
										roundInfo: getRes.data.data.roundinfo,
										diamondsCount: getRes.data.data.diamonds
									});
								}
							});
						}
					}
				});
			} else {
				wx.showModal({
					title: '提示',
					content: '钻石不足，是否充值?',
					success:function (e) {
						console.log(e)
						if (e.confirm) {
							// 充值的逻辑
							that.openRechargeBar();
						}
					}
				});
			}
		} else {
			wx.showToast({
				title: '只有通过上一关才能购买这一关哦',
				icon: 'none',
				duration: 2000
			});
		}
	},
	/**
	 * 生命周期函数--监听页面显示
	 */
	onShow: function () {
		console.log('index show');
		this.loadRoundInfo();
	},
	refreshRoundInfo() {
		let that = this;
		tools.$get({
			//获取openid接口
			data:{
				url: '/user/get_info',
				openid: app.globalData.openid
			},
			success:function(getRes){
				console.log('userinfo', getRes.data);
				let data = getRes.data;
				app.globalData.gameInfo = data.data;
				console.log(that.globalData.gameInfo)
			}
		})
	},
	// 从全局变量获取游戏信息
	loadRoundInfo() {
		let that = this;
		if (app.globalData.gameInfo && app.globalData.gameInfo.roundinfo) {
			console.log('set', app.globalData.gameInfo.roundinfo);
			let starCount = 0;
			for (let i of app.globalData.gameInfo.roundinfo) {
				starCount += i.star
			}
			this.setData({
				roundInfo: app.globalData.gameInfo.roundinfo,
				diamondsCount: app.globalData.gameInfo.diamonds,
				starCount: starCount
			});
		} else if (this.data.loadRoundInfoIndex < 100){
			this.data.loadRoundInfoIndex++;
			setTimeout(() => {
				console.log('reload roundinfo')
				that.loadRoundInfo();
			}, 200);
		} else {
			console.log('超时')
		}
		console.log('index', this.data.roundInfo)
	},
	// 从本地读取数据，测试用，已废弃
	loadRoundInfoBylocal() {
		let that = this;
		wx.getStorage({
			key: 'diamondsCount',
			success(res) {
			},
			complete(res) {
				// 无缓存信息，初始化一个并缓存
				if (res.errMsg === 'getStorage:fail data not found' || !res.data) {
					console.log('failed')
					that.setData({
						diamondsCount: 0
					});
					wx.setStorage({
						key: 'diamondsCount',
						data: 0,
						complete(res) {
							console.log(res)
						}
					});
				} else {
					that.setData({
						diamondsCount: res.data
					});
				}
			}
		});
		wx.getStorage({
			key: 'roundInfo',
			success(res) {
			},
			complete(res) {
				// 无缓存信息，初始化一个并缓存
				if (res.errMsg === 'getStorage:fail data not found' || !res.data) {
					console.log('failed')
					that.setData({
						roundInfo: [{
							star: 0,
							step: NaN
						}]
					});
					wx.setStorage({
						key: 'roundInfo',
						data: that.data.roundInfo,
						complete(res) {
						}
					});
				} else {
					that.setData({
						roundInfo: res.data
					});
					let starCount = 0;
					for (let i of that.data.roundInfo) {
						starCount += i.star
					}
					that.setData({
						starCount: starCount
					})
				}
			}
		});
	},
	onShareAppMessage() {
		return {
			title: '推箱子经典版'
		}
	},
	/**
	 * 生命周期函数--监听页面初次渲染完成
	 */
	onReady: function () {

	},

	/**
	 * 生命周期函数--监听页面隐藏
	 */
	onHide: function () {

	},

	/**
	 * 生命周期函数--监听页面卸载
	 */
	onUnload: function () {

	},

	/**
	 * 页面相关事件处理函数--监听用户下拉动作
	 */
	onPullDownRefresh: function () {

	},

	/**
	 * 页面上拉触底事件的处理函数
	 */
	onReachBottom: function () {

	},

	/**
	 * 用户点击右上角分享
	 */
	onShareAppMessage: function () {

	}
})