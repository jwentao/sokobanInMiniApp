const app = getApp();
const tools = require('../../utils/tools.js');
Component({
	options: {
		multipleSlots: true // 在组件定义时的选项中启用多slot支持
	},
	/**
	 * 组件的属性列表
	 * 用于组件自定义设置
	 */
	properties: {
		// 弹窗标题
		// option: {            // 属性名
		// 	type: Object,     // 类型（必填），目前接受的类型包括：String, Number, Boolean, Object, Array, null（表示任意类型）
		// 	value: {}     // 属性初始值（可选），如果未指定则会根据类型选择一个
		// }
	},

	/**
	 * 私有数据,组件的初始数据
	 * 可用于模版渲染
	 */
	data: {
		// 弹窗显示控制
		isShowRechargeBar: false,
		parentModel: null,
		rechargeSelIdx: -1,
		rechargeBase: [{
			diamonds: 5,
			cost: 5
		}, {
			diamonds: 11,
			cost: 10
		}, {
			diamonds: 25,
			cost: 20
		}, {
			diamonds: 70,
			cost: 50
		}]
	},

	/**
	 * 组件的方法列表
	 * 更新属性和数据的方法与更新页面数据的方法类似
	 */
	methods: {
		/*
		 * 公有方法
		 */
		//展示控制器
		showRechargeBar(that){
			console.log(that);
			// 设置sokoban页面的data
			if (that) {
				this.data.parentModel = that;
			}
			this.setData({
				isShowRechargeBar: true
			})
		},
		_closeRecharge() {
			// 设置sokoban页面的data
			console.log(this.data.sokobanModel);
			if (this.data.parentModel) {
				this.data.parentModel.setData({
					showRechargeBar: false
				});
			}
			this.setData({
				isShowRechargeBar: false
			});
		},
		// 选择充值金额
		_selRecharge(e) {
			console.log(e)
			this.setData({
				rechargeSelIdx: e.currentTarget.dataset.index
			});
		},
		// 提交充值
		_confirmRecharge() {
			let that = this;
			if (this.data.rechargeSelIdx === -1) { // 未选择充值金额
				wx.showToast({
					title: '请选择充值金额',
					icon: 'none'
				});
			} else {
				// wx.requestPayment({
				// 	complete(e) {
				// 		console.log(e)
				// 	}
				// });
				// 充值的逻辑
				// 模拟充值成功
				tools.$get({
					data:{
						url: '/user/add_dia',
						openid: app.globalData.openid,
						diamonds: that.data.rechargeBase[that.data.rechargeSelIdx].diamonds,
						cost: that.data.rechargeBase[that.data.rechargeSelIdx].cost
					},
					success:function(getRes){
						wx.showToast({
							title: '充值成功',
							icon: 'success'
						});
						app.globalData.gameInfo = getRes.data.data;
						console.log('that.data.parentModel', that.data.parentModel)
						if (that.data.parentModel) {
							that.data.parentModel.setData({
								diamondsCount: app.globalData.gameInfo.diamonds
							})
						}
						that._closeRecharge();
					}
				});
			}
		}
	}
});