let mysql = require("mysql")
let conf = require("../config/db")
let sql = require("./articleSqlMapping");
const {
	jsonWrite,
	timeFomatter,
	sqlFieldsFomatter
} = require("../common/common");
let pool = mysql.createPool(conf.mysql)
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
				if (err) return console.log(err)
				result = {
					code: 0,
					msg: "删除成功"
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
				if (err) return console.log(err)
				result = {
					code: 0,
					msg: "审核成功"
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
			connection.query(sql.rejectArticle, ["reject", rejectRemark, articleIds], (err, result) => {
				if (err) return console.log(err)
				result = {
					code: 0,
					msg: "驳回成功"
				}
				jsonWrite(res, result)
				connection.release()
			})
		})
	},
	queryArticles: (req, res, next) => {
		pool.getConnection(async (err, connection) => {
			if (err) return
			let filterContent = sqlFieldsFomatter(req.query, "a_", connection, ["title", "name"], ["pageSize", "page"]);
			let queryArticles = () => {
				return new Promise((resolve, reject) => {
					connection.query(sql.queryArticles(filterContent), [index, pageSize], (err, result) => {
						if (err) {
							console.log(err)
						} else {
							console.log(result)
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