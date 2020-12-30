let express = require("express")
let router = express.Router();
let hotPointDao = require('../dao/hotPointDao')

router.get('/queryHotPoint', (res, req, next) => {
	hotPointDao.queryHotPoint(res, req, next)
})
router.post('/deleteHotPoint', (res, req, next) => {
	hotPointDao.deleteHotPoint(res, req, next)
})
// router.post('/auditedAticle', (res, req, next) => {
// 	hotPointDao.auditedAticle(res, req, next)
// })
// router.post('/rejectArticle', (res, req, next) => {
// 	hotPointDao.rejectArticle(res, req, next)
// })
router.post('/updateHotPointCat', (res, req, next) => {
	hotPointDao.updateHotPointCat(res, req, next)
})
router.post('/updateHotPointType', (res, req, next) => {
	hotPointDao.updateHotPointType(res, req, next)
})
router.post('/updateHotPointStatus', (res, req, next) => {
	hotPointDao.updateHotPointStatus(res, req, next)
})

module.exports = router;