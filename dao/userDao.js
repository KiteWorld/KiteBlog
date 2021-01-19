var mysql = require('mysql');
var conf = require("../config/db")
let async = require('async');
var sql = require("./userSqlMapping");
const {
	queryParamsFilter,
	timeFomatter,
	curTime,
	jsonWrite,
	turnPage
} = require('../common/common');
const {
	insertCMSUser
} = require('./userSqlMapping');
var pool = mysql.createPool(conf.mysql)

module.exports = {
	//这里主要是为了演示(前期没有 async 模块，懒得改), 使用了 async...await...。实际项目中推荐使用 async 模块来完成。
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
			if (queryRes && queryRes.length > 0) {
				responeRes = {
					code: 1,
					msg: "用户已存在"
				}
			} else {
				let addRes = await add()
				responeRes = addRes || null
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
	queryUser: function (req, res, next) {
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
					connection.query(sql.queryUser(filterContent), [index, pageSize], function (err, result) {
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
			let queryUserTotal = () => {
				return new Promise((resolve, reject) => {
					connection.query(sql.queryUserTotal(filterContent), function (err, result) {
						if (err) {
							console.log(err)
						} else {
							resolve(result[0].total)
						}
					})
				})
			}
			let queryRes = await turnPage(req, queryUserTotal, queryUser)
			jsonWrite(res, queryRes)
			connection.release()
		})
	},
	queryAllUsersList: function (req, res, next) {
		pool.getConnection(async function (err, connection) {
			if (err) return
			connection.query(sql.queryAllUsersList, [req.query.userRole, '%' + req.query.userName + '%'], function (err, result) {
				if (err) {
					console.log(err)
				} else {
					result = {
						code: 0,
						data: {
							dataList: result
						},
						msg: "查询成功"
					}
				}
				jsonWrite(res, result)
				connection.release()
			})
		})
	},
	//CMS用户
	saveCMSUser: (req, res, next) => {
		pool.getConnection(async function (err, connection) {
			if (err) return
			var param = req.body;
			let queryCMSUserByName = () => {
				return new Promise((resolve, reject) => {
					connection.query(sql.queryCMSUserByName, param.name, function (err, result) {
						if (err) {
							console.log(err)
						} else {
							resolve(result)
						}
					})
				})
			}
			let saveValues = [param.userName, param.password, param.role, param.avatar, param.userId, param.createDate]
			if (param.CMSUserId) saveValues.push(param.CMSUserId)
			let saveCMSUser = () => {
				return new Promise((resolve, reject) => {
					connection.query(param.CMSUserId ? sql.updateCMSUser : sql.insertCMSUser, saveValues, function (err, result) {
						if (err) {
							console.log(err)
						} else {
							resolve({
								code: 0,
								msg: "保存成功"
							})
						}
					})
				})
			}
			let responeRes = null
			if (!param.CMSUserId) {
				let queryRes = await queryCMSUserByName()
				if (queryRes && queryRes.length > 0) {
					responeRes = {
						code: 1,
						msg: "用户已存在"
					}
					jsonWrite(res, responeRes)
					connection.release()
					return
				}
			}
			let saveRes = await saveCMSUser()
			responeRes = saveRes || null
			jsonWrite(res, responeRes)
			connection.release()
		})
	},
	queryCMSUser: function (req, res, next) {
		pool.getConnection(async function (err, connection) {
			if (err) return
			let params = {
				cms_u_name: req.query.userName || null,
				cms_u_role: req.query.userRole || null,
				cms_u_createdate: req.query.createDate || null
			}
			let filterContent = queryParamsFilter(connection, params, ["cms_u_name"], ["cms_u_createdate"]);
			let queryCMSUser = (index, pageSize) => {
				return new Promise((resolve, reject) => {
					connection.query(sql.queryCMSUser(filterContent), [index, pageSize], function (err, result) {
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
			let queryCMSUserTotal = () => {
				return new Promise((resolve, reject) => {
					connection.query(sql.queryCMSUserTotal(filterContent), function (err, result) {
						if (err) {
							console.log(err)
						} else {
							resolve(result[0].total)
						}
					})
				})
			}
			let queryRes = await turnPage(req, queryCMSUserTotal, queryCMSUser)
			jsonWrite(res, queryRes)
			connection.release()
		})
	},
	deleteCMSUser: function (req, res, next) {
		pool.getConnection(function (err, connection) {
			if (err) {
				return
			}
			const CMSUserIds = connection.escape(req.body.CMSUserIds)
			connection.query(sql.deleteCMSUser(CMSUserIds), function (err, result) {
				if (err) {
					console.log(err)
				} else {
					result = {
						code: 0,
						msg: "删除成功"
					}
				}
				jsonWrite(res, result)
				connection.release()
			})
		})
	},
	queryCMSUserById: function (req, res, next) {
		const CMSUserId = req.query.CMSUserId
		pool.getConnection(function (err, connection) {
			if (err) {
				return
			}
			connection.query(sql.queryCMSUserById, CMSUserId, function (err, result) {
				if (err) {
					console.log(err)
				} else {
					result = {
						code: 0,
						data: result[0],
						msg: "查询成功"
					}
				}
				jsonWrite(res, result)
				connection.release()
			})
		})
	},

}