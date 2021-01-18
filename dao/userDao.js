var mysql = require('mysql');
var conf = require("../config/db")
var sql = require("./userSqlMapping");
const {
	queryParamsFilter,
	timeFomatter,
	curTime,
	jsonWrite,
	turnPage
} = require('../common/common');
var pool = mysql.createPool(conf.mysql)

module.exports = {
	//这里主要是为了学习才使用 async...await...，实际项目中推荐使用 async模块来完成
	add: function (req, res, next) {
		pool.getConnection(async function (err, connection) {
			if (err) {
				return
			}
			var param = req.body;
			let queryByName = () => {
				return new Promise((resolve, reject) => {
					connection.query(sql.queryByName, param.name, function (err, result) {
						if (err) {
							console.log(err)
						} else {
							resolve(result)
						}
					})
				})
			}
			let add = () => {
				return new Promise((resolve, reject) => {
					connection.query(sql.insert, [param.name, param.password, param.sex || null, param.icon || null, curTime()], function (err, result) {
						if (err) {
							console.log(err)
						} else {
							resolve({
								code: 0,
								msg: "添加成功"
							})
						}
					})
				})
			}
			let responeRes = null
			let queryRes = await queryByName()
			if (!queryRes) {
				responeRes = {
					code: 1,
					msg: "服务器异常"
				}
			} else if (queryRes.length > 0) {
				responeRes = {
					code: 1,
					msg: "用户已存在"
				}
			} else {
				let addRes = await add()
				responeRes = addRes
				if (!addRes) {
					responeRes = {
						code: 1,
						msg: "服务器异常"
					}
				}
			}
			jsonWrite(res, responeRes)
			connection.release()
		})
	},
	update: function (req, res, next) {
		pool.getConnection(function (err, connection) {
			if (err) {
				return
			}
			var param = req.body
			connection.query(sql.update, [param.sex, param.iconPath, param.description, param.userId], function (err, result) {
				if (err) {
					console.log(err)
				} else {
					result = {
						code: 0,
						msg: "修改成功"
					}
				}
				jsonWrite(res, result)
				connection.release()
			})

		})
	},
	updateRole: function (req, res, next) {
		pool.getConnection(function (err, connection) {
			if (err) {
				return
			}
			var param = req.body
			connection.query(sql.updateRole, [param.role, param.userId], function (err, result) {
				if (err) {
					console.log(err)
				} else {
					result = {
						code: 0,
						msg: "修改成功"
					}
				}
				jsonWrite(res, result)
				connection.release()
			})

		})
	},
	updateStatus: function (req, res, next) {
		pool.getConnection(function (err, connection) {
			if (err) {
				return
			}
			let userIds = connection.escape(req.body.userIds)
			let status = req.body.status
			connection.query(sql.updateStatus(userIds), status, function (err, result) {
				if (err) {
					console.log(err)
				} else {
					result = {
						code: 0,
						msg: "修改成功"
					}
				}
				jsonWrite(res, result)
				connection.release()
			})

		})
	},
	updatePassword: function (req, res, next) {
		pool.getConnection(function (err, connection) {
			if (err) {
				return
			}
			var param = req.body
			connection.query(sql.updatePassword, [param.oldPassword, param.userId, param.newPassword, param.name], function (err, result) {
				if (err) {
					console.log(err)
				} else {
					result = {
						code: 0,
						msg: "修改成功"
					}
				}
				jsonWrite(res, result)
				connection.release()
			})

		})
	},
	delete: function (req, res, next) {
		pool.getConnection(function (err, connection) {
			if (err) {
				return
			}
			//转义
			let userIds = connection.escape(req.body.userIds)
			connection.query(sql.delete(userIds), function (err, result) {
				if (err) {
					console.log(err)
				} else {
					result = {
						code: 0,
						msg: "删除用户"
					}
				}
				jsonWrite(res, result)
				connection.release()
			})
		})
	},
	queryById: function (req, res, next) {
		const userId = req.query.userId
		pool.getConnection(function (err, connection) {
			if (err) {
				return
			}
			connection.query(sql.queryById, userId, function (err, result) {
				if (err) {
					console.log(err)
				} else {
					result = {
						code: 0,
						msg: "查询成功"
					}
				}
				jsonWrite(res, result)
				connection.release()
			})
		})
	},
	queryAll: function (req, res, next) {
		pool.getConnection(async function (err, connection) {
			if (err) return
			let params = {
				u_name: req.query.userName || null,
				u_role: req.query.userRole || null,
				u_status: req.query.userStatus || null,
				u_sex: req.query.userSex || null,
				u_createdate: req.query.createDate || null
			}
			let filterContent = queryParamsFilter(connection, params, ["u_name"], ["u_createdate"]);

			let queryUser = (index, pageSize) => {
				return new Promise((resolve, reject) => {
					connection.query(sql.queryAll(filterContent), [index, pageSize], function (err, result) {
						if (err) {
							console.log(err)
						} else {
							resolve({
								code: 0,
								data: {
									dataList: result.map(x => {
										x.createDate = timeFomatter(x.createDate)
										return x
									}),
								},
								total: 0
							})
						}
					})
				})
			}
			let queryUserCount = () => {
				return new Promise((resolve, reject) => {
					connection.query(sql.queryAllCount(filterContent), function (err, result) {
						if (err) {
							console.log(err)
						} else {
							resolve(result[0].total)
						}
					})
				})
			}
			let queryRes = await turnPage(req, queryUserCount, queryUser)
			jsonWrite(res, queryRes)
			connection.release()
		})
	},
}