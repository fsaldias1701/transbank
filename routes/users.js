var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.write(req.baseUrl)
  res.end('')
  
});

module.exports = router;
