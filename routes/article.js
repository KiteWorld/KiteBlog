let express = require("express")
let router = express.Router();
let articleDao = require('../dao/articleDao')

router.get('/queryArticles', (res, req, next) => {
	articleDao.queryArticles(res, req, next)
})
router.post('/deleteArticle', (res, req, next) => {
	articleDao.deleteArticle(res, req, next)
})
router.post('/auditedAticle', (res, req, next) => {
	articleDao.auditedAticle(res, req, next)
})
router.post('/rejectArticle', (res, req, next) => {
	articleDao.rejectArticle(res, req, next)
})

module.exports = router;