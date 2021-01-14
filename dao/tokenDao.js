var mysql = require('mysql')
var conf = require("../config/db")
var jsonWebToken = require('jsonwebtoken');
var sql = require("./tokenSqlMapping")
var common = require("../common/common")
var ENU = require("../common/enumerate");
var pool = mysql.createPool(conf.mysql)


module.exports = {
	getToken: function (role, req, res, next) {
		pool.getConnection(function (err, connection) {
			if (err) {
				console.log(err)
				return
			}
			let param = req.body
			let sqlType = role === 'CMS' ? sql.adminLogin : sql.login;
			connection.query(sqlType, [param.name, param.password], function (err, result) {
				let ret;
				if (err) {
					console.log(err)
				} else {
					if (result.length > 0) {
						let userObj = result[0]
						if (userObj.a_password === param.password || userObj.u_password === param.password) {
							if (role === "CMS") {
								ret = {
									code: 0,
									data: {
										token: jsonWebToken.sign({
											userId: userObj.a_id,
											role: userObj.a_role,
										}, ENU.SECRET_KEY, {
											expiresIn: "24h",
										}),
										name: userObj.a_name,
										role: userObj.a_role,
										userId: userObj.u_id,
									}
								}
							}
						} else {
							ret = {
								code: 0,
								data: {
									token: jsonWebToken.sign({
										userId: userObj.u_id,
									}, ENU.SECRET_KEY, {
										expiresIn: 60 * 60 * 24 * 7,
									}),
									userId: userObj.u_id,
									name: userObj.u_name,
									iconPath: userObj.u_icon,
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