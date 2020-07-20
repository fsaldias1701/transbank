const Transbank = require("transbank-sdk");

const getRandomInt = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
};

function WebpayController() {
  this.webPay = new Transbank.Webpay(Transbank.Configuration.forTestingWebpayPlusNormal()).getNormalTransaction();
  this.transactions = {};
}

WebpayController.prototype.init = async function (req, res) {
  const amount = 1500;
  const url = "https://" + req.get("host");
  const returnUrl = url + "/api/webpay-normal/response";
  const finalUrl = url + "/api/webpay-normal/finish";



  try {
    const transactionData = await this.webPay.initTransaction(
      amount,
      "Order" + getRandomInt(10000, 99999),
      "session id",
      returnUrl,
      finalUrl
    );

    this.transactions[data.token] = { amount };

    res.status(200).json({
      status: "success",
      message: "init transaction success",
      data: transactionData,
    });
  } catch (err) {
    res.status(500).json({
      status: "failure",
      message: "init transaction failure",
      errorData: err,
    });
  }

  console.log("description: ", this.webPay);
};

WebpayController.prototype.response = async function (req, res) {
  const token = req.body.token_ws;

  try {
    const transactionResult = await this.webPay.getTransactionResult(token);
    this.transactions[token] = transactionResult;

    res.status(200).json({
      status: "success",
      message: "get transaction response success",
      data: transactionResult,
    });
  } catch (err) {
    res.status(500).json({
      status: "failure",
      message: "get transaction response failure",
      errorData: err,
    });
  }
};

WebpayController.prototype.finish = function (req, res) {
  let status = null;
  let transaction = null;

  // If TBK_TOKEN is received instead of token_ws, the purchase was canceled by the user
  if (typeof req.body.TBK_TOKEN !== "undefined") {
    status = "ABORTED";
  }

  if (typeof req.body.token_ws !== "undefined") {
    transaction = transactions[req.body.token_ws];
    if (transaction.detailOutput[0].responseCode === 0) {
      status = "AUTHORIZED";
    } else {
      status = "REJECTED";
    }
  }

  // If neither token_ws nor TBK_TOKEN was received, it is a user that entered directly
  if (status === null) {
    return res.status(404).json({
      status: "failure",
      message: "not found",
    });
  }

  res.status(200).json({
    status: "success",
    message: "transaction success",
    data: { status, transaction },
  });
};

const Webpay = new WebpayController();

module.exports = Webpay;
