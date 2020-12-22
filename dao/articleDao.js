let mysql = require("mysql")
let conf = require("../config/db")
let pool = mysql.createPool(conf.mysql)
let sql = require("./articleSqlMapping");
const {
	jsonWrite,
	timeFomatter,
	queryParamsFilter,
	execTrans
} = require("../common/common");
const {
	ARTICLE_TYEP
} = require("../common/enumerate")
module.exports = {
	addAticle: (req, res, next) => {
		pool.getConnection((err, connection) => {
			if (err) return
			let param = req.body;
			connection.query(sql.addArticle)
		})
	},
	deleteArticle: (req, res, next) => {
		let articleIds = req.body.articleIds
		if (!articleIds || articleIds.length == 0) return
		pool.getConnection((err, connection) => {
			if (err) return
			connection.query(sql.deleteArticle, [articleIds], (err, result) => {
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
	auditedAticle: (req, res, next) => {
		let articleIds = req.body.articleIds
		if (!articleIds || articleIds.length == 0) return
		pool.getConnection((err, connection) => {
			if (err) return
			connection.query(sql.updateArticleStatus, ["audited", articleIds], (err, result) => {
				if (err) {
					console.log(err)
				} else {
					result = {
						code: 0,
						msg: "审核成功"
					}
				}
				jsonWrite(res, result)
				connection.release()
			})
		})
	},
	rejectArticle: (req, res, next) => {
		let articleIds = req.body.articleIds
		if (!articleIds || articleIds.length == 0) return
		let rejectRemark = req.body.rejectRemark
		pool.getConnection((err, connection) => {
			if (err) return
			connection.query(sql.rejectArticle, ["rejected", rejectRemark, articleIds], (err, result) => {
				if (err) {
					console.log(err)
				} else {
					result = {
						code: 0,
						msg: "驳回成功"
					}
				}
				jsonWrite(res, result)
				connection.release()
			})
		})
	},
	updateArticleType: (req, res, next) => {
		let articleIds = req.body.articleIds
		let articleType = Object.keys(ARTICLE_TYEP).includes(req.body.articleType) ? req.body.articleType : null
		if (!articleIds || articleIds.length == 0) return

		pool.getConnection((err, connection) => {
			if (err) {
				console.log(err)
			}
			connection.query(sql.updateArticleType, [articleType, articleIds], (err, result) => {
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
	//
	// updateArticleCat: (req, res, next) => {
	// 	let articleIds = req.body.articleIds
	// 	let categoryId = req.body.categoryId
	// 	pool.getConnection((err, connection) => {
	// 		if (err) {console.log(err)}else{
	// 		let updateArticleCat = new Promise((resolve, reject) => {
	// 			connection.query(sql.updateArticleCat, [categoryId, articleIds], (err, result) => {
	// 				if (err) {
	// 					return connection.rollback(function () {
	// 						throw err;
	// 					})
	// 				}
	// 				resolve(result)
	// 			})
	// 		})
	// 		let updateAryicleCatRel = new Promise((resolve, reject) => {
	// 			connection.query(sql.updateAryicleCatRel + "1", [categoryId, articleIds], (err, result) => {
	// 				if (err) {
	// 					return connection.rollback(function () {
	// 						throw err;
	// 					})
	// 				}
	// 				resolve(result)
	// 			})
	// 		})
	// 		connection.beginTransaction((err) => {
	// 			if (err) {
	// 				{console.log(err)}else{
	// 			}
	// 			Promise.all([updateArticleCat, updateAryicleCatRel]).then((result) => {
	// 				console.log(result)
	// 				result = {
	// 					code: 0,
	// 					msg: "修改成功"
	// 				}
	// 				jsonWrite(res, result)
	// 				connection.commit(function (err) {
	// 					if (err) {
	// 						return connection.rollback(function () {
	// 							throw err;
	// 						});
	// 					}
	// 					connection.release()
	// 				});
	// 			}).catch(err => {
	// 				console.log("eee", err)
	// 				return connection.rollback(function () {
	// 					throw err;
	// 				})
	// 			})

	// 		})
	// 	})
	// },
	updateArticleCat: (req, res, next) => {
		let articleIds = req.body.articleIds
		let categoryId = req.body.categoryId
		let sqlparamsEntities = [{
			sql: sql.updateArticleCat,
			params: [categoryId, articleIds]
		}, {
			sql: sql.updateAryicleCatRel,
			params: [categoryId, articleIds]
		}]
		execTrans(sqlparamsEntities, function (err, info) {
			var result;
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
	queryArticles: (req, res, next) => {
		pool.getConnection(async (err, connection) => {
			if (err) return
			let params = {
				a_title: req.query.title,
				a_status: req.query.status,
				a_createdate: req.query.createDate,
				a_updatedate: req.query.updateDate,
				"c.cat_id": req.query.categoryId,
				u_name: req.query.userName,
			}
			let filterContent = queryParamsFilter(connection, params, ["a_title", "u_name"], ["a_createdate", "a_updatedate"])
			let queryArticles = () => {
				return new Promise((resolve, reject) => {
					connection.query(sql.queryArticles(filterContent), [index, pageSize], (err, result) => {
						if (err) {
							console.log(err)
						} else {
							resolve({
								code: 0,
								data: {
									dataList: result.map(x => {
										x.createDate = timeFomatter(x.createDate)
										x.updateDate = timeFomatter(x.updateDate)
										return x
									}),
								},
								total: 0
							})
						}
					})
				})
			}
			let queryArticlesCount = () => {
				return new Promise((resolve, reject) => {
					connection.query(sql.queryArticlesCount(filterContent), function (err, result) {
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
				const total = await queryArticlesCount()
				if (!total) {
					queryRes = {
						code: 1,
						data: {
							dataList: []
						},
						msg: "暂无数据",
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
						queryRes = await queryArticles()
					}
					queryRes.total = total
				}
			}
			jsonWrite(res, queryRes)
			connection.release()
		})
	}
}