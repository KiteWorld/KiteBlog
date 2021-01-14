let express = require("express")
let router = express.Router();
let routerDao = require('../dao/routerDao')

router.get('/queryRouter', (res, req, next) => {
	routerDao.queryRouter(res, req, next)
})

module.exports = router