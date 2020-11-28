let jsonWrite = function (res, ret) {
	if (typeof ret === "undefined") {
		res.json({
			code: "1",
			msg: "操作失败"
		})
	} else {
		res.json(ret)
	}
}
let curTime = function (res, ret) {
	let date = new Date()
	let curTime = date.getFullYear() + "-" +
		(date.getMonth() + 1).toString().padStart(2, "0") + "-" +
		date.getDate().toString().padStart(2, "0") + ' ' +
		date.getHours().toString().padStart(2, "0") + ":" +
		date.getMinutes().toString().padStart(2, "0") + ":" +
		date.getSeconds().toString().padStart(2, "0")
	return curTime
}


module.exports = {
	jsonWrite,
	curTime
}