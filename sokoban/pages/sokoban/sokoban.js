const rounds = require('../../utils/rounds.js');
const tools = require('../../utils/tools.js');
const app = getApp();
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		gamaStatus: true, // 游戏状态
		fps: 60, // 并不是真正的fps，这里是每隔多长时间刷新一次
		stepSplit: 3, // 走一格分割成多少小步
		oneStepTime: 180, // 走一格的时间，和fps以及stepSplit是匹配的，取fps * stepSplit
		width: 0, // 画布宽,onload中获取
		sideLength: 0, // 小格边长，onload中计算
		context: null, // canvas上下文
		context2: null, // canvas上下文
		innerAudioContext: null, // audio上下文
		mapObj: {}, // 地图对象，包括人的位置
		autoWinMapObj: {}, // 自动走的地图对象
		person: {}, // 人的坐标
		personDir: 'down', // 人的朝向，默认下
		'dirArr-left': [2, 1], // 人物移动时各个方向每帧的图片
		'dirArr-right': [2, 1],
		'dirArr-up': [2, 3],
		'dirArr-down': [2, 3],
		canTouchMove: false, // 标识是否能滑动移动
		canClickMove: false, // 标识是否能点击移动
		stepCount: 0, // 计步
		round: 0, // 第几关,从0开始计数
		roundCount: 99, // 总关数
		showNextRound: false, // 显示下一关
		intervalFlag: null, // 游戏帧的循环
		autoWinIntervalFlag: null, // 自动解
		isAutoWinPause: true, // 管理自动解暂停
		isAutoWinFinish: false, // 标识自动解是否完成
		stepArr: [], // 记录步骤
		stepArrLength: 0, // 记录步骤的长度，不适用stepArr.length来表示是因为数组过大时，setdata的时间花费大
		autoWinStepArr: [], // 自动走已经走过的步骤记录
		autoWinStepIdx: 0, // 自动解idx，读取way数组用
		showAutoWinBar: false, // 标识是否显示自动解面板
		bestStepLength: -1, // 最佳解步数
		path: [], // 超出一格行走时的路径
		personMoveArr: [], // 人移动一格的节点数组
		boxMoveArr: [], // 箱子移动一格的节点数组
		pathInterval: null, // 超出一格自动寻路时的interval
		pathEnd: null, // 路径终点的标识，用于第一次自动寻路还未走完就再次使用自动寻路时
		roundInfo: [], // 过关信息
		historyBestStep: 0, // 历史最佳步数
		star: 0, // 星星数量
		diamondsCount: 0, // 钻石数量
		diamondsAddAfterPassed: 1, // 过关增加多少钻石
		showRechargeBar: false, // 是否显示充值bar
		showAudioCtrl: false, // 是否显示了音乐控制台
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
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		if (options.round) {
			this.setData({
				round: parseInt(options.round)
			});
		}
		this.setData({
			diamondsCount: app.globalData.gameInfo.diamonds
		});
		this.data.context = wx.createCanvasContext('canvas');
		this.data.context2 = wx.createCanvasContext('canvas2');
		let that = this;
		wx.getSystemInfo({
			success: function (res) {
				that.data.width = res.windowWidth;
				that.data.sideLength = res.windowWidth / 10;
				that.data.height = res.windowHeight;
				that.gameInit();
			}
		});
		this.initBgm();
		this.data.audioCtrl = this.selectComponent("#audioCtrl");
		this.data.recharge = this.selectComponent("#recharge");
		wx.getStorage({
			key: 'diamondsCount',
			complete: res => {
				if (res.errMsg !== 'getStorage:fail data not found') {
					that.setData({
						diamondsCount: res.data
					})
				}
			}
		});
	},
	// 退出前保存一下音效的设置
	onUnload() {
		console.log('unload')
		wx.setStorage({
			key: 'audioCtrlOption',
			data: app.globalData.audioCtrlOption,
			complete: function (e) {
				console.log(e)
			}
		});
	},
	// 音效
	initBgm() {
		this.data.innerAudioContext = wx.createInnerAudioContext();
		this.data.innerAudioContext.src = 'audio/step1.mp3';
		this.data.innerAudioContext.loop = true;
		this.data.innerAudioContextVictory = wx.createInnerAudioContext();
		this.data.innerAudioContextVictory.src = 'audio/victory.mp3';
	},
	touchStart(e) {
		this.data.canTouchMove = true;
		this.data.canClickMove = true;
	},
	touchMove(e) {
		this.data.canClickMove = false;
		if (this.data.canTouchMove && !this.data.showAutoWinBar) {
			let sideLength = this.data.sideLength;
			let x = Math.floor(e.touches[0].x / sideLength);
			let y = Math.floor(e.touches[0].y / sideLength);
			this.findWay(x, y);
		}
	},
	touchEnd(e) {
		this.data.canTouchMove = false;
		if (this.data.canClickMove && !this.data.showAutoWinBar) {
			let sideLength = this.data.sideLength;
			let x = Math.floor(e.changedTouches[0].x / sideLength);
			let y = Math.floor(e.changedTouches[0].y / sideLength);
			this.findWay(x, y);
		}
	},
	// 触碰点超出当前person所在位置一格时，寻找最短距离
	findWay(x, y) {
		let mapObj = this.data.mapObj;
		if ((Math.abs(x - mapObj.person.x) + Math.abs(y - mapObj.person.y) > 1 && (mapObj.map[y][x] === 2 || mapObj.map[y][x] === 4))) { // 超过一格且目标点是可到达区域需要自动寻路
			let lengthY = mapObj.map.length;
			let start = y * lengthY + x; // 坐标拼接成字符串形式
			let end = mapObj.person.y * lengthY + mapObj.person.x; // end为寻路算法的终点，实际是起点
			if (this.data.pathEnd !== null) { // 如果有存储的上次没走完的路径，以上次终点为起点
				end = this.data.pathEnd;
			}
			this.data.pathEnd = start; // 以上次走完到的点为下次的起点
			let marked = {}; // 用来存储是否已经走过
			let queue = []; // 用数组来模拟bfs算法的队列
			let fromMap = []; // 用来存储每个点的上一级是哪个点
			marked[start] = true;
			queue.push(start); // 将start点（实际为终点）作为第一个点
			// bfs算法，寻找出列的点的四周的点，如果这些点是可到达且没走过的，将这些点也入列，队列为空时循环结束
			while (queue.length > 0) {
				let first = queue.shift();
				let arr = this.findArround(first, lengthY);
				for (let i of arr) {
					if (!marked[i]) {
						marked[i] = true;
						fromMap[i] = first;
						queue.push(i);
						if (i === end) {
							queue.length = 0; // 找到end点提前终止寻步算法
						}
					}
				}
			}
			// 从end（实际的起点）开始,寻找每个点的上级，push入path数组
			for (let i = fromMap[end]; i && i !== start; i = fromMap[i]) {
				this.data.path.push(i);
			}
			this.data.path.push(start);
			if (!this.data.pathInterval) {
				// 自动寻步时，为了消除寻步开始时的延迟（interval导致的），先把第一步走了
				let i = this.data.path.shift();
				let x = parseInt(i % lengthY);
				let y = parseInt(i / lengthY);
				this.move(x, y);
				this.data.pathInterval = setInterval(() => {
					if (this.data.path.length === 0) {
						// 队列为空时，恢复pathEnd，清除循环
						this.data.pathEnd = null;
						clearInterval(this.data.pathInterval);
						this.data.pathInterval = null;
					} else {
						// path队列中，出列的即是下一步要走的
						let i = this.data.path.shift();
						let x = parseInt(i % lengthY);
						let y = parseInt(i / lengthY);
						this.move(x, y);
					}
				}, this.data.oneStepTime);
			}
		} else { // 没超过一格，直接走
			this.move(x, y);
		}
	},
	// 找到上下左右周围四个格子
	findArround(firstStr, lengthY) {
		let mapObj = this.data.mapObj;
		let arr = [];
		let first = {
			x: parseInt(firstStr % lengthY),
			y: parseInt(firstStr / lengthY)
		};
		if (mapObj.map[first.y - 1][first.x] && (mapObj.map[first.y - 1][first.x] === 2 || mapObj.map[first.y - 1][first.x] === 4)) {
			arr.push((first.y - 1) * lengthY + first.x);
		}
		if (mapObj.map[first.y + 1][first.x] && (mapObj.map[first.y + 1][first.x] === 2 || mapObj.map[first.y + 1][first.x] === 4)) {
			arr.push((first.y + 1) * lengthY + first.x);
		}
		if (mapObj.map[first.y][first.x - 1] && (mapObj.map[first.y][first.x - 1] === 2 || mapObj.map[first.y][first.x - 1] === 4)) {
			arr.push((first.y) * lengthY + first.x - 1);
		}
		if (mapObj.map[first.y][first.x + 1] && (mapObj.map[first.y][first.x + 1] === 2 || mapObj.map[first.y][first.x + 1] === 4)) {
			arr.push((first.y) * lengthY + first.x + 1);
		}
		return arr;
	},
	// 分割为小步移动
	// person: 当前位置，wy为目标位置
	personMove(person, x, y) {
		for (let i = 1; i <= this.data.stepSplit; i++) {
			this.data.personMoveArr.push(
				{
					x: person.x + (x - person.x) * i / this.data.stepSplit,
					y: person.y + (y - person.y) * i / this.data.stepSplit
				}
			)
		}
		person.x = x;
		person.y = y;
	},
	boxMove() {},
	// 移动,一次只能移动一格
	move(x, y) {
		let mapObj = this.data.showAutoWinBar ? this.data.autoWinMapObj : this.data.mapObj; // 根据此时是自动解还是手动解做选择
		if (mapObj.map[y][x] === 1 || mapObj.map[y][x] === 0) { // 点在墙或者墙外空地处，不做处理
			return;
		}
		// 点击在person一格以内
		if ((Math.abs(x - mapObj.person.x) + Math.abs(y - mapObj.person.y) === 1)) {
			this.data.personDir = x - mapObj.person.x === 1 ? 'right': x - mapObj.person.x === -1 ? 'left' : y - mapObj.person.y === 1 ? 'down' : y - mapObj.person.y === -1 ? 'up' : '';
			// 没点在箱子上
			if (mapObj.map[y][x] !== 3 && mapObj.map[y][x] !== 5) {
				this.personMove(mapObj.person, x, y);
				this.storageStep();
			} else { // 点在box上
				let tempX = x - mapObj.person.x;
				let tempY = y - mapObj.person.y;
				// box前进位置不是墙和箱子
				if (mapObj.map[y + tempY][x + tempX] !== 1 && mapObj.map[y + tempY][x + tempX] !== 3 && mapObj.map[y + tempY][x + tempX] !== 5) {
					this.personMove(mapObj.person, x, y);
					for (let i = 1; i <= this.data.stepSplit; i++) {
						this.data.boxMoveArr.push(
							{
								x: x + tempX * i / this.data.stepSplit,
								y: y + tempY * i / this.data.stepSplit
							}
						)
					}
					mapObj.map[y][x] = mapObj.map[y][x] === 5 ? 4 : 2; // box原来的位置更新为墙内空地或target
					// 箱子前进位置是target
					if (mapObj.map[y + tempY][x + tempX] === 4) {
						mapObj.map[y + tempY][x + tempX] = 5; // target位置更新为完成的target
					} else {
						mapObj.map[y + tempY][x + tempX] = 3;
					}
					this.storageStep();
				}
			}
			// 如果还存在4（没有箱子的目标点），游戏就没完成
			for (let i of mapObj.map) {
				for (let m of i) {
					if (m === 4) {
						return;
					}
				}
			}
			// 游戏完成后执行的
			if (!this.data.showAutoWinBar) { // 如果是手动解的，游戏才算过关了
				if (app.globalData.audioCtrlOption.passed.isPlay) {
					this.data.innerAudioContextVictory.play(); // 播放音效
				}
				this.data.innerAudioContext.stop();
				this.data.gamaStatus = false; // 游戏状态标记为false
				// setTimeout(() => {
					// 留出时间画最后一帧
					clearInterval(this.data.intervalFlag);
				// }, this.data.fps);
				let that = this;
				// 判断给几星
				let star = (that.data.stepArr.length - 1) / that.data.bestStepLength === 1 ? 3 : (that.data.stepArr.length - 1) / that.data.bestStepLength <= 1.7 ? 2 : 1;
				that.setData({
					star: star
				});
				console.log(app.globalData.gameInfo.roundinfo)
				if (app.globalData.gameInfo.roundinfo[that.data.round]) { // 确保有这一关的信息
					let temp = {
						isBuy: app.globalData.gameInfo.roundinfo[that.data.round].isBuy
					};
					// star取大的那个
					temp.star = star > app.globalData.gameInfo.roundinfo[that.data.round].star ? star : app.globalData.gameInfo.roundinfo[that.data.round].star;
					// 钻石的结算改到服务器进行
					// if (star === 3 && app.globalData.gameInfo.roundinfo[that.data.round].star !== 3) { // 每关第一次获取三星时可以获得钻石
					// 	// 向服务器更新钻石数据(本地结算后更新)
					// 	// this.updateDia();
					// 	tools.$get({
					// 		data:{
					// 			url: '/user/update_dia',
					// 			openid: app.globalData.openid,
					// 			diamonds: that.data.diamondsCount + that.data.diamondsAddAfterPassed
					// 		},
					// 		success:function(getRes){
					// 			console.log('userinfo', getRes.data);
					// 			let data = getRes.data;
					// 			if (data.msg === 'success') {
					// 				console.log('钻石更新成功')
					// 				that.setData({
					// 					diamondsCount: that.data.diamondsCount + that.data.diamondsAddAfterPassed
					// 				});
					// 				app.globalData.gameInfo.diamonds = that.data.diamondsCount;
					// 			}
					// 		}
					// 	})
					// }
					let needAddDia = (star === 3 && app.globalData.gameInfo.roundinfo[that.data.round].star !== 3);// 是否需要增加钻石
					if (!app.globalData.gameInfo.roundinfo[that.data.round].step) { // 没有步数信息，更新并初始化下一关(没有步数信息说明当前关是第一次通过)
						temp.step = that.data.stepArr.length - 1;
						if (!app.globalData.gameInfo.roundinfo[that.data.round + 1]) { // 没有下一关信息，初始化下一关信息（存在当前关没有过关，但是下一关已经被购买的情况）
							app.globalData.gameInfo.roundinfo[that.data.round + 1] = {
								star: 0,
								step: NaN,
								isBuy: false
							};
						}
						// 没有步数信息情况下需要更新本地及服务器数据
						app.globalData.gameInfo.roundinfo[that.data.round] = temp;
						that.updatePassed(
							needAddDia,
							function () {
								that.setData({
									showNextRound: true
								});
							}
						);
					} else { // 有步数信息，储存小的那个
						temp.step = (that.data.stepArr.length - 1) < app.globalData.gameInfo.roundinfo[that.data.round].step ? (that.data.stepArr.length - 1) : app.globalData.gameInfo.roundinfo[that.data.round].step;
						if (temp.step !== app.globalData.gameInfo.roundinfo[that.data.round].step) { // 个人最佳步数改变了才需要本地及更新服务器数据
							app.globalData.gameInfo.roundinfo[that.data.round] = temp;
							that.updatePassed(
								needAddDia,
								function () {
									that.setData({
										showNextRound: true
									});
								}
							);
						} else {
							that.setData({
								showNextRound: true
							});
						}
					}
					that.setData({
						historyBestStep: temp.step
					});
				}
				// 读取本地储存的关口信息
				// wx.getStorage({
				//   key: 'roundInfo',
				// 	complete: res => {
				// 		if (res.errMsg !== 'getStorage:fail data not found' && res.data[that.data.round]) {
				// 			let temp = {};
				// 			// star取大的那个
				// 			temp.star = star > res.data[that.data.round].star ? star : res.data[that.data.round].star;
				// 			if (star === 3 && res.data[that.data.round].star !== 3) { // 每关第一次获取三星时可以获得钻石
				// 				that.setData({
				// 					diamondsCount: that.data.diamondsCount + 1
				// 				});
				// 				wx.setStorage({
				// 					key: 'diamondsCount',
				// 					data: that.data.diamondsCount,
				// 					success(info) {
				// 						console.log('钻石更新成功', info);
				// 					}
				// 				});
				// 			}
				// 			if (!res.data[that.data.round].step) { // 没有步数信息，更新并初始化下一关
				// 				temp.step = that.data.stepArr.length - 1;
				// 				res.data[that.data.round + 1] = {
				// 					star: 0,
				// 					step: NaN
				// 				}
				// 			} else { // 有步数信息，储存小的那个
				// 				temp.step = (that.data.stepArr.length - 1) < res.data[that.data.round].step ? (that.data.stepArr.length - 1) : res.data[that.data.round].step;
				// 			}
				// 			that.setData({
				// 				historyBestStep: temp.step
				// 			});
				// 			res.data[that.data.round] = temp;
				// 			wx.setStorage({
				// 				key: 'roundInfo',
				// 				data: res.data,
				// 				success(info) {
				// 					console.log('成绩更新成功', info);
				// 				}
				// 			})
				// 		}
				// 	}
				// });
			} else {
				this.setData({ // 自动解完成的，标记自动解已经完成
					isAutoWinFinish: true
				})
			}
		}
	},
	// 将已过关卡的数据同步到服务器
	updatePassed(needAddDia, _callback) {
		console.log('updatePassed')
		let that = this;
		tools.$get({
			data:{
				url: '/user/update_passed',
				openid: app.globalData.openid,
				needadddia: needAddDia,
				roundinfo: app.globalData.gameInfo.roundinfo
			},
			success:function(getRes){
				console.log('userinfo', getRes.data);
				let data = getRes.data;
				if (data.msg === 'success') {
					console.log('关口同步成功')
					that.setData({
						diamondsCount: data.data.diamonds
					});
					app.globalData.gameInfo = data.data;
					_callback&&_callback();
				}
			}
		})
	},
	showCtrl() {
		this.data.audioCtrl.showCtrl(this);
	},
	// 回到首页
	backHome() {
		wx.redirectTo({
			url: '../index/index'
		});
	},
	openRechargeBar() {
		this.setData({
			showRechargeBar: true
		});
		this.data.recharge.showRechargeBar(this);
	},
	// 打开自动解
	clickOpenAutoWin() {
		let that = this;
		if (!app.globalData.gameInfo.roundinfo[this.data.round].isBuy) {
			if (this.data.diamondsCount >= 5) {
				wx.showModal({
					title: '提示',
					content: '花费5颗钻石来查看解法?',
					success:function (e) {
						if (e.confirm) {
							// 扣钻石的逻辑
							tools.$get({
								data:{
									url: '/user/buy_solution',
									openid: app.globalData.openid,
									round: that.data.round
								},
								success:function(getRes){
									console.log(getRes)
									app.globalData.gameInfo = getRes.data.data;
									that.setData({
										diamondsCount: getRes.data.data.diamonds
									});
									that.openAutoWin();
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
			this.openAutoWin();
		}
	},
	openAutoWin() {
		this.setData({
			showAutoWinBar: true
		});
		this.data.autoWinStepIdx = 0;
		this.autoWinMapInit();
		this.draw();
	},
	// 自动解的下一步
	autoNext() {
		if (this.data.autoWinStepIdx < this.data.autoWinMapObj.way.length) {
			this.autoWinStep();
			this.data.autoWinStepIdx++;
			this.setData({
				isAutoWinPause: true
			});
		} else {
			wx.showToast({
				title: '没有下一步了',
				icon: 'none',
				duration: 2000
			});
		}
	},
	// 自动解的上一步
	autoPre() {
		if (this.data.autoWinStepArr.length > 1) { // autoWinStepArr中储存的map有一个以上才能回退
			this.data.autoWinStepArr.pop(); // 去掉储存的最后一步
			this.data.autoWinMapObj = this.data.autoWinStepArr[this.data.autoWinStepArr.length - 1];
			this.setData({
				autoWinStepArr: this.data.autoWinStepArr,
				autoWinStepIdx: this.data.autoWinStepIdx - 1,
				isAutoWinPause: true
			});
			// 绘制
			this.draw();
		} else {
			wx.showToast({
				title: '没有上一步了',
				icon: 'none',
				duration: 2000
			});
		}
	},
	// 开启、暂停、重新开始自动演示
	autoWin() {
		if (this.data.autoWinIntervalFlag) {
			clearInterval(this.data.autoWinIntervalFlag); // 当前有循环在执行，先清除
		}
		if (!this.data.isAutoWinFinish) { // 如果演示没完成，点击效果是切换暂停/ 开始
			this.setData({
				isAutoWinPause: !this.data.isAutoWinPause
			});
		} else { // 如果演示已经完成了，点击重新初始化再重新开始演示
			this.autoWinMapInit();
			this.setData({
				isAutoWinPause: false
			});
		}
		this.data.autoWinIntervalFlag = setInterval(() => {
			if (!this.data.isAutoWinPause) { // 非暂停状态下
				this.autoWinStep();
				this.data.autoWinStepIdx++;
			}
			if (this.data.autoWinStepIdx >= this.data.autoWinMapObj.way.length) { // 走完了
				this.setData({
					isAutoWinPause: true
				});
			}
		}, this.data.oneStepTime);
	},
	// 自动解的每一步
	autoWinStep() {
		let x = this.data.autoWinMapObj.person.x;
		let y = this.data.autoWinMapObj.person.y;
		switch (this.data.autoWinMapObj.way[this.data.autoWinStepIdx]) {
			case 8: y = y - 1; break;
			case 6: x = x + 1; break;
			case 2: y = y + 1; break;
			case 4: x = x - 1; break;
		}
		this.move(x, y);
	},
	// 关闭autowin
	closeAutoWin() {
		this.setData({
			showAutoWinBar: false
		});
		clearInterval(this.data.autoWinIntervalFlag); // 关闭时要把循环清了
		this.draw();
	},
	// 下一关
	nextRound() {
		if (this.data.round < this.data.roundCount - 1) {
			this.setData({
				showNextRound: false,
				round: this.data.round + 1
			});
			this.gameInit();
		} else {
			wx.showToast({
				title: '没有下一关了',
				icon: 'none',
				duration: 2000
			});
		}
	},
	// 重新开始
	reStart() {
		this.setData({
			showNextRound: false
		});
		this.gameInit();
	},
	// 回退一步
	backStep() {
		if (this.data.stepArr.length > 1 && this.data.gamaStatus) {
			this.data.stepArr.pop(); // 去掉最后一步
			// 取去掉最后一步之后的数组最后一个（回退到前一步）
			// stepArr中只剩一步时需要深度克隆对象，因为这一步永远不会被pop掉
			if (this.data.stepArr.length === 1) {
				this.data.mapObj = {
					map: [],
					person: {}
				};
				for (let i in this.data.stepArr[this.data.stepArr.length - 1].map) {
					this.data.mapObj.map[i] = this.data.stepArr[this.data.stepArr.length - 1].map[i].slice(0);
				}
				this.data.mapObj.person.x = this.data.stepArr[this.data.stepArr.length - 1].person.x;
				this.data.mapObj.person.y = this.data.stepArr[this.data.stepArr.length - 1].person.y;
				this.data.mapObj.way = this.data.stepArr[this.data.stepArr.length - 1].way;
			} else {
				this.data.mapObj = this.data.stepArr[this.data.stepArr.length - 1];
			}
			this.data.path = []; // 将path清空，防止点击回退时path中还有数据产生bug
			this.setData({
				stepArrLength: this.data.stepArr.length - 1
			});
			// 绘制
			this.draw();
		} else {
			let title = this.data.gamaStatus ? '没有上一步了' :  '您已经完成游戏';
			wx.showToast({
				title: title,
				icon: 'none',
				duration: 2000
			});
		}
	},
	tap(e) {
	},
	// 储存步骤
	storageStep() {
		let mapObj = this.data.showAutoWinBar ? this.data.autoWinMapObj : this.data.mapObj;
		let tempMapObj = {
			map: [],
			person: {}
		};
		for (let i in mapObj.map) {
			tempMapObj.map[i] = mapObj.map[i].slice(0)
		}
		tempMapObj.person.x = mapObj.person.x;
		tempMapObj.person.y = mapObj.person.y;
		if (!this.data.showAutoWinBar) {
			this.data.stepArr.push(tempMapObj);
			this.setData({
				stepArrLength: this.data.stepArr.length - 1
			});
		} else {
			tempMapObj.way = mapObj.way;
			this.data.autoWinStepArr.push(tempMapObj);
			this.setData({
				autoWinStepArr: this.data.autoWinStepArr
			});
		}
	},
	// 画背景
	drawBg() {
		let context = this.data.context;
		let sideLength = this.data.sideLength;
		let mapObj = this.data.mapObj;
		for (let i = 0; i < mapObj.map.length; i++) {
			for (let m = 0; m < mapObj.map[i].length; m++) {
				if (mapObj.map[i][m] === 1) {
					// 墙
					context.drawImage('../../images/tab/WallRound_Brown.png', m * sideLength, i * sideLength	, sideLength, sideLength);
				} else if (mapObj.map[i][m] === 2) { // 墙内空地
					context.drawImage('../../images/tab/GroundGravel_Grass.png', m * sideLength, i * sideLength	, sideLength, sideLength);
				}else if (mapObj.map[i][m] === 4 || mapObj.map[i][m] === 5) { // 目标点
					context.drawImage('../../images/tab/EndPoint_Yellow.png', m * sideLength, i * sideLength	, sideLength - 2, sideLength - 2);
				}
			}
		}
		context.draw();
	},
	// 绘制
	draw() {
		console.log('draw')
		if (this.data.innerAudioContext && app.globalData.audioCtrlOption.step.isPlay) {
			if (this.data.personMoveArr.length > 1) {
				this.data.innerAudioContext.play();
			} else {
				this.data.innerAudioContext.stop();
			}
		}
		let context = this.data.context2;
		let width = this.data.width;
		context.clearRect(0, 0, width, width);
		let context2 = this.data.context2;
		let sideLength = this.data.sideLength;
		let mapObj = this.data.showAutoWinBar ? this.data.autoWinMapObj : this.data.mapObj;
		// 地图,0空地，1围墙，2墙内空地，3box，4target，5完成的target
		for (let i = 0; i < mapObj.map.length; i++) {
			for (let m = 0; m < mapObj.map[i].length; m++) {
				if (mapObj.map[i][m] === 0) {
					continue;
				} else if (mapObj.map[i][m] === 1) {
					// 墙
					// context2.drawImage('../../images/tab/WallRound_Brown.png', m * sideLength, i * sideLength	, sideLength, sideLength);
				} else if (mapObj.map[i][m] === 2) { // 墙内空地
					// context2.drawImage('../../images/tab/GroundGravel_Grass.png', m * sideLength, i * sideLength	, sideLength, sideLength);
				} else if (mapObj.map[i][m] === 3 &&  (this.data.boxMoveArr.length === 0 || (i !== this.data.boxMoveArr[this.data.boxMoveArr.length-1].y||m !== this.data.boxMoveArr[this.data.boxMoveArr.length-1].x))) { // 箱子
					context.drawImage('../../images/tab/Crate_Gray.png', m * sideLength, i * sideLength	, sideLength - 2, sideLength - 2);
				} else if (mapObj.map[i][m] === 4) { // 目标点
					// context.drawImage('../../images/tab/EndPoint_Yellow.png', m * sideLength, i * sideLength	, sideLength - 2, sideLength - 2);
				} else if (mapObj.map[i][m] === 5 &&  (this.data.boxMoveArr.length === 0 || (i !== this.data.boxMoveArr[this.data.boxMoveArr.length-1].y||m !== this.data.boxMoveArr[this.data.boxMoveArr.length-1].x))) { // 箱子到达目标点
					context.drawImage('../../images/tab/Crate_Yellow.png', m * sideLength, i * sideLength	, sideLength - 2, sideLength - 2);
				}
			}
		}
		// 数组有内容，box渐移
		if (this.data.boxMoveArr.length > 0) {
			let temp = this.data.boxMoveArr.shift();
			context.drawImage('../../images/tab/Crate_Gray.png', temp.x * sideLength, temp.y * sideLength	, sideLength - 2, sideLength - 2);
		}
		// person
		// context.beginPath();
		// context.setFillStyle("black");
		// context.arc(mapObj.person.x * sideLength + sideLength / 2 - 1, mapObj.person.y * sideLength + sideLength / 2 - 1, sideLength / 2 - 5, 0, 2 * Math.PI, true);
		// context.fill();
		// context.closePath();
		let tempObj = {
			left: '1',
			right: '2',
			down: '4',
			up: '7'
		};
		// 数组有内容，person渐移，数组为空时直接绘制
		if (this.data.personMoveArr.length > 0) {
			let temp = this.data.personMoveArr.shift();
			let idx = this.data['dirArr-' + this.data.personDir].shift();
			this.data['dirArr-' + this.data.personDir].push(idx);
			context.drawImage('../../images/tab/' + this.data.personDir + idx + '.png', temp.x * sideLength, temp.y * sideLength	, sideLength - 2, sideLength - 2);
		} else {
			context.drawImage('../../images/tab/Character' + tempObj[this.data.personDir] + '.png', mapObj.person.x * sideLength, mapObj.person.y * sideLength	, sideLength - 2, sideLength - 2);
		}
		context.draw();
	},
	// 初始化游戏
	gameInit() {
		console.log('gameinit')
		if (this.data.innerAudioContextVictory) {
			this.data.innerAudioContextVictory.stop();
		}
		this.data.gamaStatus = true;
		this.mapInit();
		this.drawBg();
		this.data.stepArr = [];
		this.setData({
			stepCount: 0,
			personMoveArr: [],
			boxMoveArr: []
		});
		this.storageStep();
		this.draw();
		let lastFlag = false; // 标记每次走完后是否执行最后一次绘制
		this.data.intervalFlag = setInterval(() => {
			if (this.data.personMoveArr.length > 0 || this.data.boxMoveArr.length > 0) {
				this.draw();
				if (this.data.personMoveArr.length === 1 || this.data.boxMoveArr.length === 1) {
					// 在绘制最后一小步时，激活lastFlag
					lastFlag = true
				}
			} else if (lastFlag) {
				// 绘制最后一步，主要是防止移步数组为空时，如果箱子的状态发生改变，颜色得不到绘制
				lastFlag = false;
				this.draw();
			}
		}, this.data.fps);
	},
	// 初始化地图
	mapInit() {
		this.data.roundCount = rounds.rounds.length;
		let mapObj = rounds.rounds[this.data.round];
		this.data.mapObj = {
			map: [],
			person: {}
		};
		for (let i in mapObj.map) {
			this.data.mapObj.map[i] = mapObj.map[i].slice(0);
		}
		this.data.mapObj.person.x = mapObj.person.x;
		this.data.mapObj.person.y = mapObj.person.y;
		this.data.mapObj.way = mapObj.way;
		this.setData({
			bestStepLength: mapObj.way.length
		});
	},
	// 自动走的地图初始化
	autoWinMapInit() {
		let mapObj = rounds.rounds[this.data.round];
		// 复制当前关口的数据
		this.data.autoWinMapObj = {
			map: [],
			person: {}
		};
		for (let i in mapObj.map) {
			this.data.autoWinMapObj.map[i] = mapObj.map[i].slice(0)
		}
		this.data.autoWinMapObj.person.x = mapObj.person.x;
		this.data.autoWinMapObj.person.y = mapObj.person.y;
		this.data.autoWinMapObj.way = mapObj.way;
		this.setData({
			autoWinStepIdx: 0, // 计步清0
			autoWinStepArr: [], // 走过步的缓存
			isAutoWinFinish: false, // 标记为未完成状态
			isAutoWinPause: true // 状态标记为暂停
		});
		this.storageStep(); // 需要储存初始状态为第一步
	},
	share() {
		console.log('share')
	},
	onShareAppMessage(e) {
		let title = '';
		if (this.data.showNextRound && e.from === 'button') {
			title = '我在推箱子经典版第' + (this.data.round + 1) + '关中花了' + (this.data.stepArr.length - 1) + '步，得了' + this.data.star + '星，你也来试试吧'
		} else {
			title = '推箱子经典版'
		}
		return {
			title: title,
			path: '/pages/index/index'
		}
	}
});