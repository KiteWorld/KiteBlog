var express = require('express');
var router = express.Router();

var token = require('../dao/tokenSqlMapping')

/* GET users listing. */
router.post('/login', function (req, res, next) {
	token.getToken("user", req, res, next)
});

router.post('/adminLogin', function (req, res, next) {
	token.getToken("admin", req, res, next)
})
module.exports = router;