let express = require('express');
let router = express.Router();

let categoryDao = require('../dao/categoryDao')

router.get('/getCategories', function (req, res, next) {
	return categoryDao.queryCats(req, res, next)
});
router.get('/getHotPointCategories', function (req, res, next) {
	return categoryDao.queryHotPointCats(req, res, next)
});
router.get('/getTemplateCategories', function (req, res, next) {
	return categoryDao.queryTemplateCats(req, res, next)
});
router.get('/getCategoriesList', function (req, res, next) {
	categoryDao.queryCatsList(req, res, next)
});
router.post('/deleteCategory', function (req, res, next) {
	categoryDao.delCatById(req, res, next)
});
router.post('/deleteHotPointCategory', function (req, res, next) {
	categoryDao.delCatById(req, res, next, true)
});
router.post('/insertCategories', function (req, res, next) {
	categoryDao.insertCats(req, res, next, "article")
});
router.post('/insertHotPointCategories', function (req, res, next) {
	categoryDao.insertCats(req, res, next, "hotpoint")
});
router.post('/insertTemplateCategories', function (req, res, next) {
	categoryDao.insertCats(req, res, next, "template")
});
router.post('/updateCategory', function (req, res, next) {
	categoryDao.updateCatById(req, res, next)
});
router.post('/updateHotPointCategory', function (req, res, next) {
	categoryDao.updateCatById(req, res, next)
});
router.post('/updateTemplateCategory', function (req, res, next) {
	categoryDao.updateCatById(req, res, next)
});
router.post('/transferCategory', function (req, res, next) {
	categoryDao.transferCate(req, res, next)
});
router.post('/transferHotPointCategory', function (req, res, next) {
	categoryDao.transferCate(req, res, next, true)
});
router.get('/updateCategoryOrder', function (req, res, next) {
	categoryDao.updateCategoryOrder(req, res, next)
});
router.post('/saveCategories', function (req, res, next) {
	categoryDao.save(req, res, next)
});



module.exports = router;