var query = require('../bin/query');
var insert = require('../bin/insert');

module.exports = {
	// 查询用户信息
	query: function (openid, _callback) {
		query('select * from baseinfo where openid="' + openid + '"', function (a, b, c) {
			console.log('query query')
			var resTemp = {};
			try {
				console.log(a, b)
				if (b.length > 0) {
					// b[0].roundinfo = JSON.parse(('"' + b[0].roundinfo + '"').replace(/@/g, '"'));
					b[0].roundinfo = b[0].roundinfo.replace(/@/g, '"');
					b[0].roundinfo = JSON.parse(b[0].roundinfo.substring(1, b[0].roundinfo.length - 1));
					// console.log((b[0].roundinfo).replace(/\@/g, '"'))
					console.log(b[0].roundinfo)
					resTemp = {
						msg: 'success',
						data: b[0]
					};
				} else {
					resTemp = {
						msg: 'failed, not found this openid',
						data: {}
					};
				}
				_callback && _callback(resTemp);
			} catch (e) {
				console.log(e)
			}
		});
	},
	// 增加一条用户信息
	add: function (params, _callback) {
		query('select * from baseinfo where openid="' + params.openid + '"', function (a, b, c) {
			console.log('add query')
			var resTemp = {};
			// 没查询到时才插入
			if (b.length === 0) {
				console.log('插入了')
				var roundinfo = JSON.stringify(params.roundinfo).replace(/"/g, '@');
				console.log(params.roundinfo)
				// console.log(JSON.stringify(params.roundinfo))
				if (params.openid && params.roundinfo) {
					query('insert into baseinfo (openid, roundinfo, diamonds) VALUES("' + params.openid + '","' + roundinfo + '",' + 0 + ')', function (a, b, c) {
						console.log('a', a)
						console.log('b', b)
						if (!!a) {
							_callback && _callback({
								msg: 'failed,',
								data: a
							});
						} else {
							_callback && _callback({
								msg: 'success',
								data: {}
							});
						}
					});
				}
			} else {
				console.log('已经存在')
				_callback && _callback({
					msg: 'failed, this openid has already existed',
					data: {}
				});
			}
		});
	},
	// 更新通过的关口信息
	// params包含openid、roundinfo(用户完整过关数据)、needadddia(是否需要增加钻石,可省略，默认为false)
		updatePassed: function (params, _callback) {
		console.log(params.roundinfo)
		// console.log(JSON.stringify(params.roundinfo))
		if (params.openid && params.roundinfo) {
			query('select * from baseinfo where openid="' + params.openid + '"', function (a, b, c) {
				if (!!a) {
					_callback && _callback({
						msg: 'failed,',
						data: a
					});
				} else {
					console.log('11111', typeof params.roundinfo);
					var roundinfo = JSON.stringify(params.roundinfo).replace(/"/g, '@');
					var sql = 'update baseinfo set roundinfo="' + roundinfo + '"';
					b[0].roundinfo = JSON.parse(params.roundinfo);
					console.log('params.needadddia', params.needadddia, typeof params.needadddia)
					if (params.needadddia && params.needadddia!== 'false') {
						console.log('增加钻石')
						var diamonds = b[0].diamonds + 1;
						sql += ',diamonds= ' + diamonds;
						b[0].diamonds = diamonds;
					}
					sql += ' where openid="' + params.openid + '"';
					console.log('updatepassedsql', sql)
					query( sql, function (aa, bb, cc) {
						console.log('a', a)
						console.log('b', b)
						if (!!aa) {
							_callback && _callback({
								msg: 'failed,',
								data: aa
							});
						} else {
							_callback && _callback({
								msg: 'success',
								data: b[0]
							});
						}
					});
				}
			});
		} else {
			_callback && _callback({
				msg: 'failed, lack of parameters',
				data: {}
			});
		}
	},
	// 更新钻石，钻石结算改为服务器进行，过关后的钻石更新由updatePassed完成
	// params 需要包含openid和diamonds（更新后的钻石数）
	updateDia: function (params, _callback) {
		try {
			if (params.openid && params.diamonds) {
				query('update baseinfo set diamonds="' + params.diamonds + '" where openid="' + params.openid + '"', function (a, b, c) {
					if (!!a) {
						_callback && _callback({
							msg: 'failed,',
							data: a
						});
					} else {
						_callback && _callback({
							msg: 'success',
							data: {}
						});
					}
				});
			} else {
				_callback && _callback({
					msg: 'failed, lack of parameters',
					data: {}
				});
			}
		} catch (e) {
			console.log(e)
		}
	},
	// 用户购买某一关口解法
	buySolution: function (params, _callback) {
		console.log(params)
		try {
			if (params.openid && params.round) {
				query('select * from baseinfo where openid="' + params.openid + '"', function (a, b, c) {
					if (!!a) {
						_callback && _callback({
							msg: 'failed,',
							data: a
						});
					} else {
						console.log('b00000', b[0])
						// 数据库取出的字符串转化为对象
						b[0].roundinfo = b[0].roundinfo.replace(/@/g, '"');
						b[0].roundinfo = JSON.parse(b[0].roundinfo.substring(1, b[0].roundinfo.length - 1));
						console.log('b00000', b[0])
						// 确保钻石足够
						if(b[0].diamonds >= 5) {
							console.log('enough')
							console.log(b[0].roundinfo && b[0].roundinfo[params.round])
							// 服务器有用户这关的消息
							if (b[0].roundinfo && b[0].roundinfo[params.round]) {
								b[0].roundinfo[params.round].isBuy = true;
								b[0].diamonds = b[0].diamonds - 5;
								var resObj = JSON.parse(JSON.stringify(b[0]));
								var roundinfo = '@' + JSON.stringify(b[0].roundinfo).replace(/"/g, '@') + '@';
								console.log('update after buyRound')
								query('update baseinfo set diamonds=' + b[0].diamonds + ',roundinfo="' + roundinfo + '" where openid = "' + params.openid + '"', function (a, b, c) {
									if (!!a) {
										_callback && _callback({
											msg: 'failed,',
											data: a
										});
									} else {
										_callback && _callback({
											msg: 'success,',
											data: resObj
										});
									}
								})
							}
						} else {
							console.log('not enough')
							_callback && _callback({
								msg: 'failed, not enough diamonds',
								data: b[0]
							});
						}
					}
				});
			} else {
				_callback && _callback({
					msg: 'failed, lack of parameters',
					data: {}
				});
			}
		} catch (e) {
			console.log(e)
		}
	},
	// 用户购买某一关口解法
	buyRound: function (params, _callback) {
		console.log(params)
		try {
			if (params.openid && params.round) {
				// 取出该用户信息
				query('select * from baseinfo where openid="' + params.openid + '"', function (a, b, c) {
					if (!!a) {
						_callback && _callback({
							msg: 'failed, can not find this openid',
							data: a
						});
					} else {
						console.log('b00000', b[0])
						// 数据库取出的字符串转化为对象
						b[0].roundinfo = b[0].roundinfo.replace(/@/g, '"');
						b[0].roundinfo = JSON.parse(b[0].roundinfo.substring(1, b[0].roundinfo.length - 1));
						// 确保钻石足够
						if(b[0].diamonds >= 5) {
							console.log('enough')
							console.log(b[0].roundinfo && b[0].roundinfo[params.round])
							// 服务器有用户这关的消息
							// 没有这关的信息&&购买的这关是已获取的最后一关的后一关
							if (b[0].roundinfo && !b[0].roundinfo[params.round] && parseInt(params.round) === b[0].roundinfo.length) {
								// 初始化购买的这关的信息
								b[0].roundinfo[params.round] = {
									isBuy: false,
									star: 0,
									step: null
								};
								b[0].diamonds = b[0].diamonds - 5;
								var resObj = JSON.parse(JSON.stringify(b[0]));
								var roundinfo = '@' + JSON.stringify(b[0].roundinfo).replace(/"/g, '@') + '@';
								console.log('update after buyRound');
								// 更新数据库
								query('update baseinfo set diamonds=' + b[0].diamonds + ',roundinfo="' + roundinfo + '" where openid = "' + params.openid + '"', function (a, b, c) {
									if (!!a) {
										_callback && _callback({
											msg: 'failed, failed update database ',
											data: a
										});
									} else {
										_callback && _callback({
											msg: 'success,',
											data: resObj
										});
									}
								})
							} else {
								_callback && _callback({
									msg: 'failed, can not buy this round',
									data: b[0]
								});
							}
						} else {
							console.log('not enough')
							_callback && _callback({
								msg: 'failed, not enough diamonds',
								data: b[0]
							});
						}
					}
				});
			} else {
				_callback && _callback({
					msg: 'failed, lack of parameters',
					data: {}
				});
			}
		} catch (e) {
			console.log(e)
		}
	},
	// 充值后添加钻石
	// params需要包含openid, diamonds购买多少课钻石,cost此次充值的金额
	addDia: function (params, _callback) {
		if (params.openid && params.diamonds && params.cost) {
			query('select * from baseinfo where openid="' + params.openid + '"', function (a, b, c) {
				if (!!a) {
					_callback && _callback({
						msg: 'failed,',
						data: a
					});
				} else {
					console.log('b00000', b[0])
					// 数据库取出的字符串转化为对象
					b[0].roundinfo = b[0].roundinfo.replace(/@/g, '"');
					b[0].roundinfo = JSON.parse(b[0].roundinfo.substring(1, b[0].roundinfo.length - 1));
					console.log('b00000', b[0])
						console.log(!!b[0].diamonds)
						if (b[0].diamonds || b[0].diamonds === 0) {
							b[0].diamonds = parseInt(b[0].diamonds) + parseInt(params.diamonds);
							console.log('type', typeof b[0].diamonds, typeof params.diamonds, b[0].diamonds);
							console.log('rechargeinfo', b[0].rechargeinfo)
							var resObj = JSON.parse(JSON.stringify(b[0]));
							var roundinfo = '@' + JSON.stringify(b[0].roundinfo).replace(/"/g, '@') + '@';
							var time = new Date().getTime();
							// rechargeID模拟生成，实际环境中应该由前端传入微信的支付id
							var rechargeID = time.toString() + (parseInt(10 + Math.random()*89)).toString();
							if (!b[0].rechargeinfo) {
								b[0].rechargeinfo = rechargeID;
							} else {
								b[0].rechargeinfo = b[0].rechargeinfo + ',' + rechargeID;
							}
							// 更新数据库的信息，并将更新后的数据返回给前端
							query('update baseinfo set diamonds=' + b[0].diamonds + ',rechargeinfo="' + b[0].rechargeinfo + '" where openid = "' + params.openid + '"', function (a, b, c) {
								if (!!a) {
									_callback && _callback({
										msg: 'failed,',
										data: a
									});
								} else {
									_callback && _callback({
										msg: 'success,',
										data: resObj
									});
								}
							});
							// 记录充值数据（rechargerecord表）
							console.log('insert into rechargerecord (rechargeID, time, openid, cost, diamonds) VALUES("' + rechargeID + '",' + time + ',"' + params.openid + '",' + params.cost + ',' + params.diamonds + ')')
							query('insert into rechargerecord (rechargeID, time, openid, cost, diamonds) VALUES("' + rechargeID + '",' + time + ',"' + params.openid + '",' + params.cost + ',' + params.diamonds + ')', function (a, b, c) {
								console.log('a', a)
								console.log('b', b)
								if (!!a) {
									console.log(a)
								} else {
									console.log('添加充值记录成功');
								}
							});
						}

				}
			});
		} else {
			_callback && _callback({
				msg: 'failed, lack of parameters',
				data: {}
			});
		}
	}
};