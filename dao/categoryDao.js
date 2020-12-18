var mysql = require('mysql');
var conf = require("../config/db")
var sql = require("./categoryMapping");
const {
	getFilterParams,
	jsonWrite,
	fieldsToValues
} = require('../common/common');
const {
	CATEGORY_TO_DB,
	CATEGORY_TO_FRONT
} = require("../common/sqlFields");
const e = require('express');
var pool = mysql.createPool(conf.mysql)

module.exports = {

	delCatById: (req, res, next) => {
		const categoryId = req.body.categoryId
		if (!categoryId) return
		pool.getConnection(async (err, connection) => {
			if (err) {
				return console.log(err)
			}
			let queryCatArticleCount = () => {
				return new Promise((resolve, reject) => {
					connection.query(sql.queryCatArticleCount, categoryId, (err, result) => {
						if (err) {
							console.log(err)
						} else {
							if (result[0].articleCount) {
								resolve({
									code: 1,
									msg: "该分类下存在文章，请先迁移文章到其他分类再删除!"
								})
							} else {
								resolve(null)
							}
						}
					})
				})
			}
			let queryChildrenCount = () => {
				return new Promise((resolve, reject) => {
					connection.query(sql.queryChildrenCount, categoryId, (err, result) => {
						if (err) {
							console.log(err)
						} else {
							if (result[0].childrenCount) {
								resolve({
									code: 1,
									msg: "该分类存在子分类无法删除"
								})
							} else {
								resolve(null)
							}
						}
					})
				})
			}
			let delCatById = () => {
				return new Promise((resolve, reject) => {
					if (err) {
						return console.log(err)
					}
					connection.query(sql.delCatById, categoryId, (err, result) => {
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
			let result = await queryCatArticleCount()
			if (!result) result = await queryChildrenCount()
			if (!result) result = await delCatById()
			jsonWrite(res, result)
			connection.release()
		})

	},
	insertCats: (req, res, next) => {
		pool.getConnection(function (err, connection) {
			if (err) {
				return console.log(err)
			}
			if (!req.body.insertCats || !req.body.insertCats instanceof Array) return
			let valuesList = req.body.insertCats.map(x => {
				let values = [x.categoryName, x.categoryParentId, x.categoryStatus, x.categoryOrder, x.categoryLevel, x.description]
				return values
			})
			//批量添加，valuesList为数组，数组的每一项也数组（values），就是需要添加的单条数据。传值给query()时，valuesList还需要放在数组里面 [valuesList]
			connection.query(sql.insertCats, [valuesList], (err, result) => {
				if (err) {
					console.log(err)
				} else {
					console.log(result)
					result = {
						code: 0,
						data: {
							categoryId: result.insertId
						},
						msg: "添加成功"
					}
				}
				jsonWrite(res, result)
				connection.release()
			})

		})
	},
	updateCatById: (req, res, next) => {
		pool.getConnection(function (err, connection) {
			if (err) {
				return console.log(err)
			}
			let params = req.body;
			let values = [params.categoryName, params.categoryParentId, params.categoryStatus, params.categoryOrder, params.description, params.categoryId]
			connection.query(sql.updateCatById, values, (err, result) => {
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
	updateCategoryOrder: (req, res, next) => {
		pool.getConnection(function (err, connection) {
			if (err) {
				return console.log(err)
			}
			//get方法url，传boolean值，传的是字符串。
			connection.query(sql.updateCategoryOrder, [req.query.categoryOrder, req.query.categoryId], (err, result) => {
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
	queryAllCatsList: (req, res, next) => {
		pool.getConnection(function (err, connection) {
			if (err) {
				return console.log(err)
			}
			connection.query(sql.queryAllCatsList, (err, result) => {
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
	queryAllCats: (req, res, next) => {
		pool.getConnection(function (err, connection) {
			if (err) {
				console.log(err)
				return
			}
			connection.query(sql.queryAllCats, (err, result) => {
				let dataList = []
				if (err) {
					console.log("err1", err)
				} else {
					//区分不同等级的分类
					let levelObj = {}
					result.forEach(x => {
						x.children = []
						if (!levelObj[x.categoryLevel]) {
							levelObj[x.categoryLevel] = []
						}
						levelObj[x.categoryLevel].push(x)

					})
					let levelList = Object.keys(levelObj).sort((a, b) => a - b) //保证先处理等级高的分类
					let categoryIdIndex = {}
					levelList.forEach(x => {
						//一级分类
						if (x == 1) {
							dataList.push(...levelObj[x].map((y, i) => {
								categoryIdIndex[y.categoryId] = [i]
								y.categoryStatus = Boolean(y.categoryStatus)
								return y
							}))
						} else {
							//其他级别分类
							levelObj[x].forEach((y, index) => {
								let parentIndex = categoryIdIndex[y.categoryParentId]
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
								//把子类的文章数加到父类
								// parent.articleCount += y.articleCount
								y.categoryStatus = Boolean(y.categoryStatus)
								parent.children.push(y)
								categoryIdIndex[y.categoryId] = [...parentIndex, parent.children.length - 1]
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
	//适用于一次性保存。如果类型很多建议改成把 增删改分开
	save: function (req, res, next) {
		pool.getConnection(async function (err, connection) {
			if (err) {
				return
			}
			let categories = req.body.categories
			let addCats = []
			let updateCats = []
			let updateIds = req.body.updateCatIds //删、改的数据id
			let categoriesIds = await getCatIdsDao()
			//获取删除的类别
			let deleteCatIds = (categories.filter(x => x.categoryId || false)).map(y => {
				if (!categoriesIds.includes(y)) return y
			})
			let paramProps = Object.keys(CATEGORY_TO_FRONT)
			categories.forEach(x => {
				const item = getFilterParams(x, paramProps)
				if (!item.categoryId) {
					addCats.push(item)
				} else {
					//避免数据库操作没有修改的数据
					if (updateIds.includes(item.categoryId)) {
						updateCats.push(item)
					}
				}
			});

			let getCatIdsDao = () => {
				return new Promise((resolve, reject) => {
					connection.query(sql.getCatIds, function (err, result) {
						if (err) {
							reject(err)
						} else {
							resolve(result)
						}
					})
				})
			}
			let insertCatsDao = () => {
				return new Promise((resolve, reject) => {
					let fields = Object.keys(CATEGORY_TO_DB)
					let insertContentList = addCats.map(x => {
						let values = []
						for (const key in x) {
							if (Object.hasOwnProperty.call(x, key) && fields.includes(key)) {
								values = x[key];
							}
						}
						return values.join(",")
					})
					connection.query(sql.insertCats(insertContentList.join(",")), function (err, result) {
						if (err) {
							resolve(err)
						} else {
							resolve(result)
						}
					})
				})
			}
			let delCatsDao = () => {
				return new Promise((resolve, reject) => {
					connection.query(sql.delCats(connection.escape(deleteCatIds.join(","))), function (err, result) {
						if (err) {
							reject(err)
						} else {
							resolve(result)
						}
					})
				})
			}
			let updateCatsDao = () => {
				return new Promise((resolve, reject) => {
					let str = ""
					let fieldStrObj = {};
					updateCats.forEach(x => {
						for (const key in x) {
							if (Object.hasOwnProperty.call(x, key !== "categoryId")) {
								fieldStrObj[x] += `when ${x.categoryId} then ${x[key]} `;
							}
						}
					})
					paramProps.forEach(x => {
						if (x !== "categoryId") {
							str += `${x} = case categoryId `
							str += fieldStrObj[x]
						}
					})
					connection.query(sql.updateCats(str), function (err, result) {
						if (err) {
							reject(result)
							console.log(err)
						} else {
							resolve(result)
						}
					})
				})
			}
			connection.beginTransaction((err) => {
				let promiseList = []
				if (addCats.length > 0) promiseList.push(insertCatsDao)
				if (deleteCatIds.length > 0) promiseList.push(delCatsDao)
				if (updateCats.length > 0) promiseList.push(updateCatsDao)
				if (promiseList.length == 0) {
					return
				}
				Promise.all(promiseList).then(result => {
					result = {
						code: 0,
						msg: "保存成功"
					}
					jsonWrite(res, result)
					connection.release()
				}).catch(err => {
					connection.rollback()
					connection.release()
					console.log(err)
				})
			})
		})
	},
}