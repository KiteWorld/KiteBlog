let mysql = require("mysql")
let async = require("async")
let conf = require("../config/db")
let pool = mysql.createPool(conf.mysql)
let sql = require("./hotPointMapping");
const {
	jsonWrite,
	timeFomatter,
	queryParamsFilter,
	transaction,
	turnPage,
	curTime
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
	queryHotPointById: (req, res, next) => {
		const hotPointId = req.query.hotPointId
		pool.getConnection((err, connection) => {
			if (err) {
				console.log(err)
			}
			connection.query(sql.queryHotPointById, [hotPointId], (err, result) => {
				if (err) {
					console.log(err)
				} else {
					if (result.length > 0) {
						result[0].createDate = timeFomatter(result[0].createDate)
						result = {
							code: 0,
							data: {
								...result[0]
							},
							msg: "查询成功"
						}
					}
				}
				jsonWrite(res, result)
				connection.release()
			})
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
	saveHotPoint: (req, res, next) => {
		pool.getConnection((err, connection) => {
			if (err) return console.log(err)
			connection.beginTransaction((err) => {
				if (err) return console.log(err)
				const saveParams = [
					req.body.content,
					req.body.pictrue || null,
					req.body.createDate || curTime(),
					req.body.hotPointType || 'top',
					req.body.userId,
					req.body.categoryId,
				];
				const addRelParams = [null, req.body.categoryId];
				const saveHotPoint = (cb) => {
					connection.query(req.body.hotPointId ? sql.updateHotPoint : sql.insertHotPoint, saveParams, (err, result, fields) => {
						if (err) {

							console.log(err)
							return cb(err, null);
						} else {
							result = req.body.hotPointId ? req.body.hotPointId : result.insertId
							return cb(null, result);
						}
					})
				}
				const addHotPointCatRel = (hotPointId, cb) => {
					addRelParams[0] = hotPointId
					connection.query(sql.insertHotPointCatRel, addRelParams, (err, result, fields) => {
						if (err) {
							console.log(err)
							return cb(err, null);
						} else {
							return cb(null, hotPointId);
						}
					})
				}
				if (req.body.hotPointId) {
					saveParams.push(req.body.hotPointId)
					funcAry = [saveHotPoint];
				} else {
					funcAry = [saveHotPoint, addHotPointCatRel];
				}
				async.waterfall(funcAry, (error, hotPointId) => {
					if (error) {
						connection.rollback((err) => {
							connection.release();
							error = err || error
							jsonWrite(res, null)
						});
					} else {
						connection.commit((err, result) => {
							if (err) {
								connection.rollback((err) => {
									connection.release();
									console.log(err)
								});
							} else {
								console.log(result)
								result = {
									code: 0,
									data: {
										hotPointId: hotPointId
									},
									msg: '保存成功'
								}
								connection.release();
								jsonWrite(res, result)
							}
						})
					}
				})
			});
		});
	},
}