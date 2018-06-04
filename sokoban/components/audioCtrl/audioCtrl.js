const app = getApp();
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
		isShowAudioCtrl: false,
		option: app.globalData.audioCtrlOption,
		sokobanModel: null
	},

	/**
	 * 组件的方法列表
	 * 更新属性和数据的方法与更新页面数据的方法类似
	 */
	methods: {
		/*
		 * 公有方法
		 */

		//隐藏弹框
		hideDialog(){
			this.setData({
				isShowAudioCtrl: !this.data.isShowAudioCtrl
			})
		},
		//展示控制器
		showCtrl(that){
			console.log(that)
			// 设置sokoban页面的data
			if (that) {
				that.setData({
					showAudioCtrl: true
				});
			}
			this.data.sokobanModel = that;
			this.setData({
				isShowAudioCtrl: true
			})
		},
		/*
		 * 内部私有方法建议以下划线开头
		 * triggerEvent 用于触发事件
		 */
		_autioCtrl(e){
			console.log(e);
			let that = this;
			app.globalData.audioCtrlOption[e.currentTarget.dataset.key].isPlay = !app.globalData.audioCtrlOption[e.currentTarget.dataset.key].isPlay;
			console.log(app.globalData.audioCtrlOption[e.currentTarget.dataset.key].isPlay, e.currentTarget.dataset.key === 'bgm' && app.globalData.audioCtrlOption[e.currentTarget.dataset.key].isPlay)
			if (e.currentTarget.dataset.key === 'bgm') {
				if (app.globalData.audioCtrlOption[e.currentTarget.dataset.key].isPlay) {
					app.globalData.bgmContext.play();
				} else {
					app.globalData.bgmContext.stop();
				}
			}
			console.log(app.globalData.audioCtrlOption)
			this.setData({
				option: app.globalData.audioCtrlOption
			})
		},
		_closeCtrl() {
			// 设置sokoban页面的data
			console.log(this.data.sokobanModel);
			if (this.data.sokobanModel) {
				this.data.sokobanModel.setData({
					showAudioCtrl: false
				});
			}
			wx.setStorage({
				key: 'audioCtrlOption',
				data: app.globalData.audioCtrlOption,
				complete: function (e) {
					console.log(e)
				}
			});
			this.setData({
				isShowAudioCtrl: false
			});
		},
		_stop() {}
	}
});