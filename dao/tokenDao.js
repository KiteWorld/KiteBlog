var mysql = require('mysql')
var conf = require("../config/db")
var jsonWebToken = require('jsonwebtoken');
var sql = require("./tokenSqlMapping")
var common = require("../common/common")
var ENU = require("../common/enumerate")
var pool = mysql.createPool(conf.mysql)

module.exports = {
	getToken: function (role, req, res, next) {
		pool.getConnection(async function (err, connection) {
			if (err) {
				return
			}
			let param = req.boby
			let sqlType = role === 'admin' ? sql.adminLogin : sql.login;
			connection.query(sqlType, param.userId, function (err, result) {
				if (err) {
					return
				}
				let ret;
				if (result.length > 0) {
					let userObj = result[0]
					if (userObj.a_password === password || userObj.u_password === password) {
						if (role === "admin") {
							ret = {
								code: 0,
								data: {
									token: jsonWebToken.sign({
										userId: userObj.a_id
									}, ENU.SECRET_KEY, {
										expiresIn: "24h"
										// expiresIn: 60 * 60 * 24
									}),
									userId: userObj.a_password,
									name: userObj.a_name,
									role: userObj.a_role,
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
				}
				common.jsonWrite(ret)
				connection.release()
			})
		})
	}
}