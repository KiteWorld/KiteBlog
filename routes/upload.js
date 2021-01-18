let express = require("express")
let router = express.Router();
let uploadDao = require('../dao/uploadDao')
const {
	upload
} = require("../common/common");

router.post('/uploadAvatar', upload, (res, req, next) => {
	uploadDao.uploadAvatar(res, req, next)
})

module.exports = router