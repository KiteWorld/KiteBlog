let mysql = require("mysql")
let async = require("async")
let conf = require("../config/db")
let pool = mysql.createPool(conf.mysql)
let sql = require("./routerMapping");
const {
	jsonWrite,
	timeFomatter,
	turnPage,
	curTime,
	routerItemFormatter
} = require("../common/common");


module.exports = {
	queryRouter: (req, res, next) => {
		pool.getConnection(async (err, connection) => {
			if (err) return
			console.log(req.user.role)
			connection.query(sql.queryRouter, `%${req.user.role}%`, (err, result) => {
				let dataList = []
				if (err) {
					console.log("err1", err)
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
								return routerItemFormatter(y)
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
								parent.children.push(routerItemFormatter(y))
								routerIdIndex[y.routerId] = [...parentIndex, parent.children.length - 1]
							})
						}
					})
				}
				result = {
					code: 0,
					data: {
						dataList: dataList
					},
					msg: "查询成功"
				}
				jsonWrite(res, result)
				connection.release()
			})
		})
	},

}