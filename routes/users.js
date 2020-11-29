var express = require('express');
var router = express.Router();

var userDao = require('../dao/userDao')

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});

router.get('/queryAll', function (req, res, next) {
  userDao.queryAll(req, res, next)
});

router.post('/addUser', function (req, res, next) {
  userDao.add(req, res, next)
})
module.exports = router;