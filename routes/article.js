let express = require("express")
let router = express.Router();
let articleDao = require('../dao/articleDao')

router.get('/queryArticles', (res, req, next) => {
	articleDao.queryArticles(res, req, next)
})
router.get('/queryTemplate', (res, req, next) => {
	articleDao.queryArticles(res, req, next, true)
})
router.get('/queryArticleById', (res, req, next) => {
	articleDao.queryArticleById(res, req, next)
})
router.post('/saveArticle', (res, req, next) => {
	articleDao.saveArticle(res, req, next)
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
router.post('/updateArticleCat', (res, req, next) => {
	articleDao.updateArticleCat(res, req, next)
})
router.post('/updateArticleType', (res, req, next) => {
	articleDao.updateArticleType(res, req, next)
})

module.exports = router;