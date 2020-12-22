var mysql = require('mysql');
var conf = require("../config/db")
var sql = require("./userSqlMapping");
const {
	sqlFieldsFomatter,
	timeFomatter,
	curTime,
	jsonWrite
} = require('../common/common');
var pool = mysql.createPool(conf.mysql)

module.exports = {
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
			let filterContent = sqlFieldsFomatter(req.query, "u_", connection, ["name"], ["pageSize", "page"]);
			let queryUser = () => {
				return new Promise((resolve, reject) => {
					connection.query(sql.queryAll(filterContent), [index, pageSize], function (err, result) {
						if (err) {
							console.log(err)
						} else {
							resolve({
								code: 0,
								data: {
									dataList: result.map(x => {
										x.createTime = timeFomatter(x.createTime)
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
			const pageSize = Number(req.query.pageSize)
			const page = Number(req.query.page)
			let index;
			let queryRes;
			if (pageSize <= 0 || page <= 0) {
				queryRes = {
					code: 1,
					msg: "pageSize或page不能为0"
				}
			} else {
				const total = await queryUserCount()
				if (!total) {
					queryRes = {
						code: 1,
						data: {
							dataList: []
						},
						msg: "没有用户数据",
						total: total,
					}
				} else {
					index = (page - 1) * pageSize < 0 ? 0 : (page - 1) * pageSize;
					if (index > total && total) {
						queryRes = {
							code: 1,
							msg: "已超出了总条数"
						}
					} else {
						queryRes = await queryUser()
					}
					queryRes.total = total
				}
			}
			jsonWrite(res, queryRes)
			connection.release()
		})
	},
}