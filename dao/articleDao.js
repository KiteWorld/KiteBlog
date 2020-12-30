let mysql = require("mysql")
let conf = require("../config/db")
let pool = mysql.createPool(conf.mysql)
let sql = require("./articleSqlMapping");
const {
	jsonWrite,
	timeFomatter,
	queryParamsFilter,
	transaction,
	turnPage
} = require("../common/common");
const {
	ARTICLE_HOTPOINT_TYEP
} = require("../common/enumerate")
module.exports = {
	addAticle: (req, res, next) => {
		pool.getConnection((err, connection) => {
			if (err) return
			let param = req.body;
			connection.query(sql.addArticle)
		})
	},
	//删除
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
	//审核
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
	//驳回
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
	//修改文章类型（热门、置顶、推荐、普通）
	updateArticleType: (req, res, next) => {
		let articleIds = req.body.articleIds
		let articleType = Object.keys(ARTICLE_HOTPOINT_TYEP).includes(req.body.articleType) ? req.body.articleType : null
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
	//修改文章所属分类
	updateArticleCat: (req, res, next) => {
		let articleIds = req.body.articleIds
		let categoryId = req.body.categoryId
		let sqlParamsEntities = [{
			sql: sql.updateArticleCat,
			params: [categoryId, articleIds]
		}, {
			sql: sql.updateArticleCatRel,
			params: [categoryId, articleIds]
		}]
		transaction(sqlParamsEntities, (err, info) => {
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
	//查询文章（支持标题、创建人、状态、分类、时间段等搜索）
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
			let queryArticles = (index, pageSize) => {
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
			let queryRes = await turnPage(req, queryArticlesCount, queryArticles)
			jsonWrite(res, queryRes)
			connection.release()
		})
	}
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
	// 		let updateArticleCatRel = new Promise((resolve, reject) => {
	// 			connection.query(sql.updateArticleCatRel + "1", [categoryId, articleIds], (err, result) => {
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
	// 			Promise.all([updateArticleCat, updateArticleCatRel]).then((result) => {
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

}