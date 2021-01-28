const {
	jsonWrite,
} = require("../common/common");

module.exports = {
	uploadAvatar: function (req, res, next) {
		console.log(req.file)
		jsonWrite(res, {
			code: 1,
			data: {
				imgUrl: global.servers.BASE_URL + req.file.destination + "/" + req.file.filename
			},
			msg: "上传成功"
		})
	}
}