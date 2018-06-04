// 数据库查询连接
var conf = require('../../config/index');
var mysql = require('mysql');

// 创建数据库连接池
var pool = mysql.createPool(conf);

// 为了防止数据库超过一定时间未活动，连接会自动关闭造成错误：PROTOCOL_CONNECTION_LOST，每次请求都使用pool创建一个connection
var query = function (sql, callback) {
  console.log('sql', sql)
  this.getConnection(function (err, conn) {
    if (err) {
      callback(err, null, null);
    } else {
      conn.query(sql, function (qerr, vals, fields) {
        // 事件驱动回调
        try {
					callback.apply(conn, arguments);
					// 释放连接
					conn.release();
        } catch (e) {
          console.log(e)
        }
      });
    }
  })
}.bind(pool);

module.exports = query;