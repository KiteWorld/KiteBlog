var mysql = require('mysql');
var conf = require("../config/db")
var async = require('async');
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
	//这里主要是为了演示(其实是懒得改，哈哈), 使用了 async...await...。实际项目中推荐使用 async 模块来完成。
	saveUser: (req, res, next) => {
		pool.getConnection(async function (err, connection) {
			if (err) return
			var param = req.body;
			let queryIsExist = () => {
				return new Promise((resolve, reject) => {
					connection.query(sql.queryIsExist, [param.userName, param.email || null, param.phone || null], function (err, result) {
						if (err) {
							console.log(err)
						} else {
							resolve(result)
						}
					})
				})
			}
			let saveValues = [param.userName, param.password, param.userRole, param.userStatus, param.avatar || null, param.userSex || 0, param.email, param.phone, curTime()]
			if (param.userId) saveValues.push(param.userId)
			let saveUser = () => {
				return new Promise((resolve, reject) => {
					connection.query(param.userId ? sql.update : sql.insert, saveValues, function (err, result) {
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
			let queryRes = await queryIsExist()
			if (queryRes && queryRes.length > 0) {
				const isExist = queryRes.some(x => {
					//如果查询出来的 id 和传入的 id 相等，说明他们是同一个用户，不需要和自己对比
					if (param.userId !== x.u_id) {
						if (param.userName && param.userName === x.u_name) {
							responeRes = {
								code: 1,
								msg: "用户名已经被使用"
							}
						}
						if (param.email && param.email === x.u_email) {
							responeRes = {
								code: 1,
								msg: "邮箱已经注册了"
							}
						}
						if (param.phone && param.phone === x.u_phone) {
							responeRes = {
								code: 1,
								msg: "手机已经注册了"
							}
						}
						return true
					}
				});
				if (isExist) {
					jsonWrite(res, responeRes)
					connection.release()
					return
				}
			}
			let saveRes = await saveUser()
			responeRes = saveRes || null
			jsonWrite(res, responeRes)
			connection.release()
		})
	},
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
	queryUserById: function (req, res, next) {
		const userId = req.query.userId
		pool.getConnection(function (err, connection) {
			if (err) {
				return
			}
			connection.query(sql.queryUserById, userId, function (err, result) {
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
			connection.query(sql.queryAllUsersList, ['tocms', '%' + req.query.userName + '%'], function (err, result) {
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
					connection.query(sql.queryCMSUserByName, param.userName, function (err, result) {
						if (err) {
							console.log(err)
						} else {
							resolve(result)
						}
					})
				})
			}
			let saveValues = [param.userName, param.password, param.userRole, param.avatar || null, param.ToCUserId || null, curTime(), param.jobNo]
			if (param.CMSUserId) saveValues[saveValues.length - 1] = param.CMSUserId
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
			let queryRes = await queryCMSUserByName()
			if (queryRes && queryRes.length > 0) {
				if (param.CMSUserId !== queryRes[0].cms_u_id) {
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
		if (req.body.CMSUserIds.includes(req.user.CMSUserId)) {
			return jsonWrite(res, {
				code: 1,
				msg: "无法删除自身账号"
			})
		}
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

	//实际项目不推荐显示工号，后端自动分配就好，这里为了方便查看新增的工号是多少才做了这个接口
	queryJobNoMax: function (req, res, next) {
		pool.getConnection(function (err, connection) {
			if (err) {
				return
			}
			const sqlFormatter = sql.queryJobNoMax + (req.query.userRole === "superadmin" ? "cms_u_job_no > 100000000" : "1 <= cms_u_job_no and cms_u_job_no <= 100000000")
			connection.query(sqlFormatter, function (err, result) {
				if (err) {
					console.log(err)
				} else {
					console.log(result)
					const jobNo = ((Number(result[0].jobNo) + 1) + "").padStart(6, "0")
					result[0].jobNo = jobNo
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
	}
}