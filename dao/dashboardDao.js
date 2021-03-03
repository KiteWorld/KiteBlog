let mysql = require("mysql")
let conf = require("../config/db")
let pool = mysql.createPool(conf.mysql)
let sql = require("./dashboardSqlMapping");
module.exports = {
	queryTotal: () => {
		return new Promise((resolve, reject) => {
			pool.getConnection(async (err, connection) => {
				if (err) {
					reject(false)
					return
				}
				let sqlObj = {
					"ARTICLE_TOTAL": sql.queryArticlesCount,
					"HOTPOINT_TOTAL": sql.queryHotPointsCount,
					"USER_TOTAL": sql.queryUsersCount
				}
				for (const key in sqlObj) {
					const total = () => {
						return new Promise((resolve, reject) => {
							connection.query(sqlObj[key], (err, result) => {
								if (err) {
									reject(-1)
								} else {
									console.log(result)
									resolve(result[0].total)
								}
							})
						})
					}
					global.servers[key] = await total()
				}
				connection.release()
				resolve(true)
			})
		})
	},

	articleHot10: (time) => {
		return new Promise((resolve, reject) => {
			pool.getConnection(async (err, connection) => {
				if (err) {
					reject(false)
					return
				}
				connection.query(time === "today" ? sql.queryTodayArticleHot10 : sql.queryArticleHot10, (err, result) => {
					if (err) {
						return
					} else {
						if (result.length === 0) {
							resolve([])
						} else {
							console.log(result)
							resolve(result)
						}
						connection.release()
					}
				})
			})
		})
	},
	queryDayTotal: (dateRange, day) => {
		return new Promise((resolve, reject) => {
			pool.getConnection(async (err, connection) => {
				if (err) {
					reject(false)
					return
				}
				let sqlObj = {
					articleDayTotal: sql.queryArticleDayTotal(dateRange, day),
					hotPointDayTotal: sql.queryHotPointDayTotal(dateRange, day),
					userDayTotal: sql.queryUserDayTotal(dateRange, day)
				}
				const date = {
					articleDayTotal: [],
					hotPointDayTotal: [],
					userDayTotal: [],
				}
				for (const key in sqlObj) {
					const total = () => {
						return new Promise((resolve, reject) => {
							connection.query(sqlObj[key], (err, result) => {
								if (err) {
									console.log(err)
									reject(-1)
								} else {
									resolve(result)
								}
							})
						})
					}
					date[key] = await total()
				}
				connection.release()
				resolve(date)
			})
		})
	},
	queryCatTotal: () => {
		return new Promise((resolve, reject) => {
			pool.getConnection(async (err, connection) => {
				if (err) {
					reject(false)
					return
				}
				// let sqlObj = {
				// 	articleDayTotal: sql.queryArticleDayTotal(dateRange, day),
				// 	hotPointDayTotal: sql.queryHotPointDayTotal(dateRange, day),
				// 	userDayTotal: sql.queryUserDayTotal(dateRange, day)
				// }
				// const date = {
				// 	articleDayTotal: [],
				// 	hotPointDayTotal: [],
				// 	userDayTotal: [],
				// }
				for (const key in sqlObj) {
					const total = () => {
						return new Promise((resolve, reject) => {
							connection.query(sqlObj[key], (err, result) => {
								if (err) {
									console.log(err)
									reject(-1)
								} else {
									resolve(result)
								}
							})
						})
					}
					date[key] = await total()
				}
				connection.release()
				resolve(date)
			})
		})
	}
}