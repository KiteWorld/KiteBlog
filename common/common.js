var jsonWrite = function (res, ret) {
	if (typeof ret === "undefined") {
		res.json({
			code: "1",
			msg: "操作失败"
		})
	} else {
		res.json(ret)
	}
}
var curTime = function () {
	var date = new Date()
	return timeFomatter(date)
}

var timeFomatter = function (time) {
	return time.getFullYear() + "-" +
		(time.getMonth() + 1).toString().padStart(2, "0") + "-" +
		time.getDate().toString().padStart(2, "0") + ' ' +
		time.getHours().toString().padStart(2, "0") + ":" +
		time.getMinutes().toString().padStart(2, "0") + ":" +
		time.getSeconds().toString().padStart(2, "0")
}

var sqlParamsFomatter = function (param, pre, connection, fuzzyParams = []) {
	if (param instanceof Object) {
		let filterArr = []
		for (const key in param) {
			if (param.hasOwnProperty(key) && param[key]) {
				if (fuzzyParams.includes(key)) {
					//「connection.escapeId」用于查询标识符转义，connection.escape用于值转义
					filterArr.push(`${connection.escapeId(pre + key)} LIKE ${connection.escape(param[key]+"%")}`)
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

module.exports = {
	jsonWrite,
	curTime,
	timeFomatter,
	sqlParamsFomatter
}