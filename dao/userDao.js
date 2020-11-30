var mysql = require('mysql');
var conf = require("../config/db")
var sql = require("./userSqlMapping");
var common = require('../common/common');
const express = require('express');
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
					connection.query(sql.insert, [param.name, param.password, param.sex || null, param.icon || null, common.curTime()], function (err, result) {
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
			common.jsonWrite(res, responeRes)
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
				common.jsonWrite(res, result)
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
				common.jsonWrite(res, result)
				connection.release()
			})

		})
	},
	updateStatus: function (req, res, next) {
		pool.getConnection(function (err, connection) {
			if (err) {
				return
			}
			let userIds = req.body.userIds
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
				common.jsonWrite(res, result)
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
				common.jsonWrite(res, result)
				connection.release()
			})

		})
	},
	delete: function (req, res, next) {
		const userId = req.query.userId
		pool.getConnection(function (err, connection) {
			if (err) {
				return
			}
			connection.query(sql.delete, userId, function (err, result) {
				if (err) {
					console.log(err)
				} else {
					result = {
						code: 0,
						msg: "删除用户"
					}
				}
				common.jsonWrite(res, result)
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
				common.jsonWrite(res, result)
				connection.release()
			})
		})
	},
	queryAll: function (req, res, next) {
		pool.getConnection(async function (err, connection) {
			if (err) {
				return
			}

			let queryUser = () => {
				return new Promise((resolve, reject) => {
					connection.query(sql.queryAll, [min, max], function (err, result) {
						if (err) {
							console.log(err)
						} else {
							resolve({
								code: 0,
								data: {
									users: result.map(x => {
										x.createTime = common.timeFomatter(x.createTime)
										return x
									}),
									total: 0
								}
							})
						}
					})
				})
			}
			let queryUserCount = () => {
				return new Promise((resolve, reject) => {
					connection.query(sql.queryAllCount, function (err, result) {
						if (err) {
							console.log(err)
						} else {
							resolve(result[0].total)
						}
					})
				})
			}
			const total = await queryUserCount()

			//处理limit 最大最小值
			const pageSize = req.query.pageSize
			const page = req.query.page
			let max = page * pageSize > total ? total : page * pageSize;
			let min = max - pageSize < 0 ? 0 : max - pageSize;

			let queryRes = await queryUser()
			queryRes.data.total = total

			common.jsonWrite(res, queryRes)
			connection.release()
		})
	},


}