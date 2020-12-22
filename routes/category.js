let express = require('express');
let router = express.Router();

let categoryDao = require('../dao/categoryDao')

router.get('/getCategories', function (req, res, next) {
	categoryDao.queryAllCats(req, res, next)
});
router.get('/getCategoriesList', function (req, res, next) {
	categoryDao.queryAllCatsList(req, res, next)
});
router.post('/deleteCategory', function (req, res, next) {
	categoryDao.delCatById(req, res, next)
});
router.post('/insertCategories', function (req, res, next) {
	categoryDao.insertCats(req, res, next)
});
router.post('/updateCategory', function (req, res, next) {
	categoryDao.updateCatById(req, res, next)
});
router.get('/updateCategoryOrder', function (req, res, next) {
	categoryDao.updateCategoryOrder(req, res, next)
});

router.post('/saveCategories', function (req, res, next) {
	categoryDao.save(req, res, next)
});

module.exports = router;