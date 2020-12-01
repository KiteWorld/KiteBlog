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

var sqlParamsFomatter = function (param, pre, connection) {
	if (param instanceof Object) {
		if (!Object.keys(param).length) {
			return "1 = 1"
		}
		let str = ""
		for (const key in param) {
			if (param.hasOwnProperty(key)) {
				//「connection.escapeId」用于查询标识符转义，connection.escape用于值转义
				str += `${connection.escapeId(pre + key)} LIKE ${connection.escape("%"+param[key]+"%")}`
			}
		}
		return str
	}
}

module.exports = {
	jsonWrite,
	curTime,
	timeFomatter,
	sqlParamsFomatter
}