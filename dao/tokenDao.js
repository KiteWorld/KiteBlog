var mysql = require('mysql')
var conf = require("../config/db")
var jsonWebToken = require('jsonwebtoken');
var sql = require("./tokenSqlMapping")
var common = require("../common/common")
var pool = mysql.createPool(conf.mysql)


module.exports = {
	getToken: function (type, req, res, next) {
		pool.getConnection(function (err, connection) {
			if (err) {
				console.log(err)
				return
			}
			let param = req.body
			let sqlType = type === 'CMS' ? sql.adminLogin : sql.login;
			connection.query(sqlType, [param.jobNo, param.password], function (err, result) {
				let ret;
				if (err) {
					console.log(err)
				} else {
					if (result.length > 0) {
						let userObj = result[0]
						if (type === "CMS") {
							ret = {
								code: 0,
								data: {
									token: jsonWebToken.sign({
										CMSUserId: userObj.CMSUserId,
										role: userObj.role,
									}, global.servers.SECRET_KEY, {
										expiresIn: "24h", //token有效期
										// algorithm:"HS256"  默认使用 "HS256" 算法来签名
									}),
									name: userObj.name,
									jobNo: userObj.jobNo,
									role: userObj.role,
									userId: userObj.userId,
									CMSUserId: userObj.CMSUserId
								}
							}
						} else {
							ret = {
								code: 0,
								data: {
									token: jsonWebToken.sign({
										userId: userObj.userId,
										role: userObj.role,
									}, global.servers.SECRET_KEY, {
										expiresIn: 60 * 60 * 24 * 7, // 两种写法
									}),
									name: userObj.name,
									role: userObj.role,
									userId: userObj.userId,
								}
							}
						}
					} else {
						ret = {
							code: 1,
							msg: "账号或者密码错误"
						}
					}
				}
				common.jsonWrite(res, ret)
				connection.release()
			})

		})
	}
}