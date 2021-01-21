var express = require('express');
var router = express.Router();

var userDao = require('../dao/userDao')

//ToC用户
router.get('/queryUser', function (req, res, next) {
  userDao.queryUser(req, res, next)
});

router.get('/queryUserById', function (req, res, next) {
  userDao.queryUserById(req, res, next)
});

router.get('/queryAllUsersList', function (req, res, next) {
  userDao.queryAllUsersList(req, res, next)
});

router.post('/saveUser', function (req, res, next) {
  userDao.saveUser(req, res, next)
});

router.post('/addUser', function (req, res, next) {
  userDao.add(req, res, next)
});

router.post('/deleteUsers', function (req, res, next) {
  userDao.delete(req, res, next)
});

router.post('/updateStatus', function (req, res, next) {
  userDao.updateStatus(req, res, next)
})

//CMS用户
router.get('/queryCMSUser', function (req, res, next) {
  userDao.queryCMSUser(req, res, next)
});

router.get('/queryCMSUserById', function (req, res, next) {
  userDao.queryCMSUserById(req, res, next)
});

router.get('/queryJobNoMax', function (req, res, next) {
  userDao.queryJobNoMax(req, res, next)
});

router.post('/saveCMSUser', function (req, res, next) {
  userDao.saveCMSUser(req, res, next)
});

router.post('/deleteCMSUser', function (req, res, next) {
  userDao.deleteCMSUser(req, res, next)
});

module.exports = router;