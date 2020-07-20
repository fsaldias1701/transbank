var express = require('express');
var transaction = require('../controller/WebPay');
var router = express.Router();

router.get("/",transaction.indexJustForDemonstration);
router.post("/init", transaction.init);
router.post("/second", transaction.cbTransaction);
router.post("/finish", transaction.finishTransaction);

module.exports = router;