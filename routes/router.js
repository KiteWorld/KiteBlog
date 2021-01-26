let express = require("express")
let router = express.Router();
let routerDao = require('../dao/routerDao')

router.get('/queryRouter', (res, req, next) => {
	routerDao.queryRouter(res, req, next)
})
router.post('/saveRouter', (res, req, next) => {
	routerDao.saveRouter(res, req, next)
})
router.post('/deleteRouter', (res, req, next) => {
	routerDao.deleteRouter(res, req, next)
})

module.exports = router