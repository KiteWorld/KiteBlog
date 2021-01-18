const {
	jsonWrite,
} = require("../common/common");
const {
	ROOT_URL,
} = require("../common/enumerate");

module.exports = {
	uploadAvatar: function (req, res, next) {
		console.log(req.file)
		jsonWrite(res, {
			code: 1,
			data: {
				imgUrl: ROOT_URL + req.file.destination + "/" + req.file.filename
			},
			msg: "上传成功"
		})
	}
}