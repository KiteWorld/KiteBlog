let express = require("express")
let router = express.Router();
let hotPointDao = require('../dao/hotPointDao')

router.get('/queryHotPoint', (res, req, next) => {
	hotPointDao.queryHotPoint(res, req, next)
})
router.get('/queryHotPointById', (res, req, next) => {
	hotPointDao.queryHotPointById(res, req, next)
})
router.post('/deleteHotPoint', (res, req, next) => {
	hotPointDao.deleteHotPoint(res, req, next)
})
router.post('/updateHotPointCat', (res, req, next) => {
	hotPointDao.updateHotPointCat(res, req, next)
})
router.post('/updateHotPointType', (res, req, next) => {
	hotPointDao.updateHotPointType(res, req, next)
})
router.post('/updateHotPointStatus', (res, req, next) => {
	hotPointDao.updateHotPointStatus(res, req, next)
})
router.post('/saveHotPoint', (res, req, next) => {
	hotPointDao.saveHotPoint(res, req, next)
})

module.exports = router;