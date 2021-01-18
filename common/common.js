const async = require('async');
const mysql = require("mysql")
const conf = require("../config/db")
const pool = mysql.createPool(conf.mysql)
const path = require("path");
const multer = require('multer')

let jsonWrite = function (res, ret) {
	if (typeof ret === "undefined" || ret === null) {
		res.json({
			code: "1",
			msg: "操作失败"
		})
	} else {
		res.json(ret)
	}
}
let curTime = function () {
	let date = new Date()
	return timeFomatter(date)
}


let timeFomatter = function (time) {
	return time.getFullYear() + "-" +
		(time.getMonth() + 1).toString().padStart(2, "0") + "-" +
		time.getDate().toString().padStart(2, "0") + ' ' +
		time.getHours().toString().padStart(2, "0") + ":" +
		time.getMinutes().toString().padStart(2, "0") + ":" +
		time.getSeconds().toString().padStart(2, "0")
}
/* 
	@param get请求 query对象（url拼接的参数）
	@pre 表字段前缀
	@connection connection对象，用于转义
	@fuzzyParams  需要支持模糊匹配的字段
	@removeParams 排除的字段。
*/
let sqlFieldsFomatter = function (param, pre, connection, fuzzyParams = [], removeParams = []) {
	if (param instanceof Object) {
		let filterArr = []
		for (const key in param) {
			if (param.hasOwnProperty(key) && param[key] && !removeParams.includes(key)) {
				if (fuzzyParams.includes(key)) {
					//「connection.escapeId」用于查询标识符转义，connection.escape用于值转义
					filterArr.push(`${connection.escapeId(pre + key)} LIKE "%"${connection.escape(param[key])}"%"`)
				} else {
					filterArr.push(`${connection.escapeId(pre + key)} = ${connection.escape(param[key])}`)
				}
			}
		}
		if (!filterArr.length) {
			return "1 = 1"
		}
		return filterArr.join(' and ')
	}
}
let queryParamsFilter = function (connection, params, fuzzyParams = [], dateParams = []) {
	if (params instanceof Object) {
		let filterArr = []
		for (const key in params) {
			if (params.hasOwnProperty(key) && params[key]) {
				if (fuzzyParams.includes(key)) {
					//「connection.escapeId」用于查询标识符转义，connection.escape用于值转义
					filterArr.push(`${connection.escapeId(key)} LIKE "%"${connection.escape(params[key])}"%"`)
				} else if (dateParams.includes(key)) {
					filterArr.push(`${connection.escape(params[key][0])} <= ${connection.escapeId(key)}`)
					filterArr.push(`${connection.escapeId(key)} <= ${connection.escape(params[key][1])}`)
				} else {
					filterArr.push(`${connection.escapeId(key)} = ${connection.escape(params[key])}`)
				}
			}
		}
		if (!filterArr.length) {
			return "1 = 1"
		}
		return filterArr.join(' and ')
	}
}

let getFilterParams = (param, enu) => {
	if (!enu instanceof Array) return
	let props = enu
	const obj = {}
	for (const key in param) {
		if (props.includes(key)) {
			obj[key] = param[key];
		}
	}
	return obj
}
let arrayToObject = (arr) => {
	let obj = {}
	arr.forEach(x => {
		obj[x] = null
	});
	return obj
}
let fieldsToValues = (params, arr, enu) => {
	let frontFeilds = arr.map(x => enu[x])
	let values = frontFeilds.map(x => params[x]) || []
	return values
}
//翻页数据处理
let turnPage = async (req, getItemsCount, getItems) => {
	const pageSize = Number(req.query.pageSize);
	const page = Number(req.query.page);
	let queryRes;
	let index;
	if (pageSize <= 0 || page <= 0) {
		queryRes = {
			code: 1,
			msg: "pageSize或page不能为0"
		}
	} else {
		const total = await getItemsCount()
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
				queryRes = await getItems(index, pageSize)
			}
			queryRes.total = total
		}
	}
	return queryRes
}
//批量处理、多表数据同步处理的事务
let transaction = (sqlparamsEntities, callback, asyncMethod = "series") => {
	pool.getConnection((err, connection) => {
		if (err) {
			return callback(err, null);
		}
		connection.beginTransaction((err) => {
			if (err) {
				return callback(err, null);
			}
			var funcAry = [];
			sqlparamsEntities.forEach((sqlItem) => {
				var temp = (cb) => {
					connection.query(sqlItem.sql, sqlItem.params, (tErr, rows, fields) => {
						if (tErr) {
							return cb(tErr, null);
						} else {
							return cb(null, 'ok');
						}
					})
				};
				funcAry.push(temp);
			});
			//asyncMethod 只支持 parallel、series 这些方法接收的参数是一致，不传转递数据的 async模块方法 
			async [asyncMethod](funcAry, (error, result) => {
				if (error) {
					connection.rollback((err) => {
						connection.release();
						error = err || error //如果回滚错误，优先返回回滚错误
						return callback(error, null);
					});
				} else {
					//提交事务
					connection.commit((err, info) => {
						if (err) {
							//报错回滚
							connection.rollback((err) => {
								connection.release();
								return callback(err, null);
							});
						} else {
							connection.release();
							return callback(null, info);
						}
					})
				}
			})
		});
	});
};

let routerItemFormatter = (item) => {
	const routerItem = {
		path: item.path,
		component: item.component,
		name: item.name,
		children: [],
		meta: {
			title: item.title,
			isAffix: Boolean(item.isAffix),
			noCache: Boolean(item.noCache),
			icon: item.icon,
			roles: item.roles.split(",") || [item.roles],
			level: item.routerLevel
		},
	}
	if (item.redirect) routerItem.redirect = item.redirect
	return routerItem
}

let upload = (req, res, next) => {
	let filename = "";
	let fullPath = path.resolve(__dirname, "../public/uploads");
	let storage = multer.diskStorage({
		//设置存储路径
		destination: (req, file, cb) => {
			cb(null, 'public/uploads');
		},
		//设置存储的文件名
		filename: (req, file, cb) => {
			//获取文件的扩展名
			let extname = path.extname(file.originalname);
			filename = file.fieldname + "-" + Date.now() + extname;
			cb(null, filename);
		}
	})
	let upload = multer({
		storage: storage
	}).single("file");
	/* single属性名需和上传的name一致否则报错：multererr:MulterError: */
	upload(req, res, (err) => {
		/* 文件存入 */
		if (err instanceof multer.MulterError) {
			res.send("multererr:" + err);
			console.log("multererr:" + err);
			return false;
		} else if (err) {
			res.send("err:" + err);
			return false;
		} else {
			next();
		}
	})

}
// let upload = (req, uploadPath, props = {
// 	type: "single",
// 	fileName: "file"
// }, ) => {
// 	let storage = multer.diskStorage({
// 		destination: (req, file, cb) => {
// 			cb(null, 'uploads/' + uploadPath);
// 		},
// 		filename: (req, file, cb) => {
// 			let extname = path.extname(file.originalname);
// 			let filename = file.fieldname + "-" + Date.now() + extname;
// 			cb(null, filename);
// 		}
// 	})
// 	let uploadObj = multer({
// 		storage: storage
// 	}).single(props.fileName)
// 	// if (props.type === "single") {
// 	// 	upload = upload[props.type](props.fileName);
// 	// }
// 	// if (props.type === "array") {
// 	// 	upload = upload[props.type](props.fileName, props.maxCount);
// 	// }
// 	// if (props.type === "fields") {
// 	// 	upload = upload[props.type](props.fileName);
// 	// }

// 	//.none() .any 不会用到，就不做处理

// 	let file = null
// 	uploadObj(req, res, (err) => {
// 		if (err instanceof multer.MulterError) {
// 			console.log("multererr:" + err);
// 			return file;
// 		} else if (err) {
// 			return file;
// 		} else {
// 			console.log(req.file);
// 			file = res.file
// 		}
// 	})
// 	return file

// }


module.exports = {
	jsonWrite,
	curTime,
	timeFomatter,
	sqlFieldsFomatter,
	getFilterParams,
	arrayToObject,
	fieldsToValues,
	transaction,
	queryParamsFilter,
	turnPage,
	routerItemFormatter,
	upload
}