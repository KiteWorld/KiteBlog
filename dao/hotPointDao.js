let mysql = require("mysql")
let conf = require("../config/db")
let pool = mysql.createPool(conf.mysql)
let sql = require("./hotPointMapping");
const {
	jsonWrite,
	timeFomatter,
	queryParamsFilter,
	transaction
} = require("../common/common");
module.exports = {
	//查询沸点（支持标题、创建人、状态、分类、时间段等搜索）
	queryHotPoint: (req, res, next) => {
		pool.getConnection(async (err, connection) => {
			if (err) return
			let params = {
				hp_createdate: req.query.createDate,
				"cat.cat_id": req.query.categoryId,
				u_name: req.query.userName,
			}
			let filterContent = queryParamsFilter(connection, params, ["u_name"], ["hp_createdate"])
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
		let sqlparamsEntities = [{
			sql: sql.updateHotPointCat,
			params: [categoryId, hotPointIds]
		}, {
			sql: sql.updateAryicleCatRel,
			params: [categoryId, hotPointIds]
		}]
		transaction(sqlparamsEntities, function (err, info) {
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
	//删除
	deleteHopPoint: (req, res, next) => {
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