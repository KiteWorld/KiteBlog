let mysql = require("mysql")
let conf = require("../config/db")
let pool = mysql.createPool(conf.mysql)
let sql = require("./routerMapping");
const {
	jsonWrite,
	routerItemFormatter
} = require("../common/common");


module.exports = {
	queryRouter: (req, res, next) => {
		pool.getConnection(async (err, connection) => {
			if (err) return
			//req.user对象 是token解析出来的用户信息
			connection.query(sql.queryRouter, req.user.role, (err, result) => {
				let dataList = []
				if (err) {
					console.log(err)
				} else {
					let levelObj = {}
					result.forEach(x => {
						x.children = []
						if (!levelObj[x.routerLevel]) {
							levelObj[x.routerLevel] = []
						}
						levelObj[x.routerLevel].push(x)

					})
					let levelList = Object.keys(levelObj).sort((a, b) => a - b)
					let routerIdIndex = {}
					levelList.forEach(x => {
						if (x == 1) {
							dataList.push(...levelObj[x].map((y, i) => {
								routerIdIndex[y.routerId] = [i]
								return routerItemFormatter(y, routerIdIndex[y.routerId])
							}))
						} else {
							levelObj[x].forEach((y, index) => {
								let parentIndex = routerIdIndex[y.routerParentId]
								let parent = dataList
								for (let i = 0; i < parentIndex.length; i++) {
									if (i === 0) {
										parent = parent[parentIndex[i]]
									} else {
										parent = parent.children[parentIndex[i]]
									}
								}
								if (!parent.children) {
									parent.children = []
								}
								routerIdIndex[y.routerId] = [...parentIndex, parent.children.length]
								parent.children.push(routerItemFormatter(y, routerIdIndex[y.routerId]))
							})
						}
					})
				}
				result = {
					code: 0,
					data: {
						dataList: dataList,
					},
					msg: "查询成功"
				}
				jsonWrite(res, result)
				connection.release()
			})
		})
	},

	deleteRouter(req, res, next) {
		pool.getConnection(async (err, connection) => {
			if (err) {
				return console.log(err)
			}
			let queryChildrenCount = () => {
				return new Promise((resolve, reject) => {
					connection.query(sql.queryChildrenCount, req.body.routerId, (err, result) => {
						if (err) {
							console.log(err)
						} else {
							if (result[0].childrenCount) {
								resolve({
									code: 1,
									msg: "该分类存在子导航菜单无法删除"
								})
							} else {
								resolve(null)
							}
						}
					})
				})
			}
			let delRouterById = () => {
				return new Promise((resolve, reject) => {
					if (err) {
						return console.log(err)
					}
					connection.query(sql.delRouterById, req.body.routerId, (err, result) => {
						if (err) {
							console.log(err)
						} else {
							resolve(result = {
								code: 0,
								msg: "删除成功"
							})
						}
					})
				})
			}
			result = await queryChildrenCount()
			if (!result) result = await delRouterById()
			jsonWrite(res, result)
			connection.release()
		})

	},
	saveRouter: (req, res, next) => {
		pool.getConnection(async function (err, connection) {
			if (err) return
			let param = req.body;
			let meta = param.meta;

			let queryRouterIsExist = () => {
				return new Promise((resolve, reject) => {
					connection.query(sql.queryRouterIsExist, [param.path, param.name], function (err, result) {
						if (err) {
							console.log(err)
						} else {
							resolve(result)
						}
					})
				})
			}
			let saveValues = [
				param.path,
				param.name,
				meta.title,
				meta.isAffix || false,
				param.meta.roles.join(","), meta.icon,
				meta.noCache,
				param.redirect,
				param.component,
				meta.parentId,
				meta.order,
				meta.level,
				meta.isExternal,
				meta.target
			]
			if (meta.routerId) saveValues.push(meta.routerId)
			let saveRouter = () => {
				return new Promise((resolve, reject) => {
					connection.query(meta.routerId ? sql.updateRouterById : sql.insertRouter, saveValues, function (err, result) {
						if (err) {
							console.log(err)
						} else {
							resolve({
								code: 0,
								data: {
									routerId: result.insertId
								},
								msg: "保存成功"
							})
						}
					})
				})
			}
			let responeRes = null
			let queryRes = await queryRouterIsExist()
			if (queryRes && queryRes.length > 0) {
				const isExist = queryRes.some(x => {
					if (meta.routerId !== x.r_id) {
						if (param.path && param.path === x.r_path) {
							responeRes = {
								code: 1,
								msg: "路由地址已存在"
							}
						}
						if (param.name && param.name === x.r_name) {
							responeRes = {
								code: 1,
								msg: "路由名称已存在"
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

			let saveRes = await saveRouter()
			responeRes = saveRes || null
			jsonWrite(res, responeRes)
			connection.release()
		})
	}
}