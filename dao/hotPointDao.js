let mysql = require("mysql")
let conf = require("../config/db")
let pool = mysql.createPool(conf.mysql)
let sql = require("./hotPointMapping");
const {
	jsonWrite,
	timeFomatter,
	queryParamsFilter,
	transaction,
	turnPage
} = require("../common/common");
const {
	ARTICLE_HOTPOINT_TYEP,
	HOTPOINT_STATUS
} = require("../common/enumerate")
module.exports = {
	//查询沸点（支持标题、创建人、状态、分类、时间段等搜索）
	queryHotPoint: (req, res, next) => {
		pool.getConnection(async (err, connection) => {
			if (err) return
			let params = {
				hp_content: req.query.hotPointContent,
				hp_status: req.query.hotPointStatus,
				u_name: req.query.userName,
				hp_createdate: req.query.createDate,
				"c.cat_id": req.query.categoryId,
			}
			let filterContent = queryParamsFilter(connection, params, ["hp_content", "u_name"], ["hp_createdate"])
			let queryHotPoint = (index, pageSize) => {
				return new Promise((resolve, reject) => {
					connection.query(sql.queryHotPoint(filterContent), [index, pageSize], (err, result) => {
						if (err) {
							console.log(err)
						} else {
							resolve({
								code: 0,
								data: {
									dataList: result.map(x => {
										x.createDate = timeFomatter(x.createDate)
										if (x.hotPointPictrues) x.hotPointPictrues = x.hotPointPictrues.split(",")
										return x
									}),
								},
								total: 0
							})
						}
					})
				})
			}
			let queryHotPointCount = () => {
				return new Promise((resolve, reject) => {
					connection.query(sql.queryHotPointCount(filterContent), function (err, result) {
						if (err) {
							console.log(err)
						} else {
							resolve(result[0].total)
						}
					})
				})
			}

			let queryRes = await turnPage(req, queryHotPointCount, queryHotPoint)
			jsonWrite(res, queryRes)
			connection.release()
		})
	},
	//修改沸点所属分类
	updateHotPointCat: (req, res, next) => {
		let hotPointIds = req.body.hotPointIds
		let categoryId = req.body.categoryId
		let sqlParamsEntities = [{
			sql: sql.updateHotPointCat,
			params: [categoryId, hotPointIds]
		}, {
			sql: sql.updateHotPointCatRel,
			params: [categoryId, hotPointIds]
		}]
		transaction(sqlParamsEntities, function (err, info) {
			let result;
			if (err) {
				console.log(err)
			} else {
				result = {
					code: 0,
					msg: '修改成功'
				};
			}
			jsonWrite(res, result);
		})
	},
	//修改文章类型（热门、置顶、推荐、普通）
	updateHotPointType: (req, res, next) => {
		let hotPointIds = req.body.hotPointIds
		let hotPointType = Object.keys(ARTICLE_HOTPOINT_TYEP).includes(req.body.hotPointType) ? req.body.hotPointType : null
		if (!hotPointIds || hotPointIds.length == 0) return
		pool.getConnection((err, connection) => {
			if (err) {
				console.log(err)
			}
			connection.query(sql.updateHotPointType, [hotPointType, hotPointIds], (err, result) => {
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
	updateHotPointType: (req, res, next) => {
		let hotPointIds = req.body.hotPointIds
		let hotPointType = Object.keys(ARTICLE_HOTPOINT_TYEP).includes(req.body.hotPointType) ? req.body.hotPointType : null
		if (!hotPointIds || hotPointIds.length == 0) return
		pool.getConnection((err, connection) => {
			if (err) {
				console.log(err)
			}
			connection.query(sql.updateHotPointType, [hotPointType, hotPointIds], (err, result) => {
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
	updateHotPointStatus: (req, res, next) => {
		let hotPointIds = req.body.hotPointIds
		let hotPointStatus = Object.keys(HOTPOINT_STATUS).includes(req.body.hotPointStatus) ? req.body.hotPointStatus : null
		if (!hotPointIds || hotPointIds.length == 0) return
		pool.getConnection((err, connection) => {
			if (err) {
				console.log(err)
			}
			connection.query(sql.updateHotPointStatus, [hotPointStatus, hotPointIds], (err, result) => {
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
	//删除
	deleteHotPoint: (req, res, next) => {
		let hotPointIds = req.body.hotPointIds
		if (!hotPointIds || hotPointIds.length == 0) return
		pool.getConnection((err, connection) => {
			if (err) return
			connection.query(sql.deleteHotPoint, [hotPointIds], (err, result) => {
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
}