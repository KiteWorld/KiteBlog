var express = require('express');
var router = express.Router();

var userDao = require('../dao/userDao')


router.get('/queryUsers', function (req, res, next) {
  userDao.queryAll(req, res, next)
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

module.exports = router;