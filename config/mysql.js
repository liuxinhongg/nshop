// 引入mysql模块
var mysql = require("mysql");
// 创建连接池
var pool = mysql.createPool({
	host:"localhost",
	user:'root',
	password:'root',
	database:'vnshop'
})
// 导出query()方法
exports.query = function(sql,arr,callback){
	// 链接数据库
	pool.getConnection(function(err,connection){
		if(err){
			throw err;
			return;
		}
		// 执行sql语句
		connection.query(sql,arr,function(error,results){
		// 释放连接,功其他文件重复使用
			connection.release();
			if(error){
				throw error;
			}
			// 执行回掉函数，将数据返回
			callback && callback(results)
		})
	})
}

