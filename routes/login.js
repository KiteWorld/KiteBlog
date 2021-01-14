var express = require('express');
var router = express.Router();

var token = require('../dao/tokenDao')

router.post('/login', function (req, res, next) {
	token.getToken("toC", req, res, next)
});

router.post('/adminLogin', function (req, res, next) {
	token.getToken("CMS", req, res, next)
})
module.exports = router;