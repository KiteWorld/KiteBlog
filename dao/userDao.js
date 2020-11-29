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
			console.log(param)
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
				console.log(common.curTime())
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
			var param = req.body
			connection.query(sql.updateStatus, [param.status, param.userId], function (err, result) {
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
		// const userId = req.query.userId
		pool.getConnection(function (err, connection) {
			if (err) {
				return
			}
			connection.query(sql.queryAll, function (err, result) {
				if (err) {

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
	}

}