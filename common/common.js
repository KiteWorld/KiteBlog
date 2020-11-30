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



module.exports = {
	jsonWrite,
	curTime,
	timeFomatter
}