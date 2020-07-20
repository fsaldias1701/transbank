var express = require('express');
var Transbank = require('transbank-sdk');
var router = express.Router();
var axios = require('axios');
var FormData = require('form-data');
var qs = require('qs');


const transaction = new Transbank.Webpay(
  Transbank.Configuration.forTestingWebpayPlusNormal()
).getNormalTransaction();

router.post('/result',(req,res)=>{
  // Obtener el token desde el paraemtro token_ws recibido por POST
// Si usas express, sería algo como esto:
const token = req.body.token_ws;
transaction.getTransactionResult(token)
  .then((response) => {
    const output = response.detailOutput[0];
    if (output.responseCode === 0) {
        console.log('success');
        console.log(response);
        res.json(response);
    }
  })
  .catch((error) => {
    console.log(error.toString())
    // Cualquier error durante la transacción será recibido acá
  });

})


router.get('/',(req,res)=>{
  const amount = 1000;
  // Identificador que será retornado en el callback de resultado:
  const sessionId = 'mi-id-de-sesion';
  // Identificador único de orden de compra:
  const buyOrder = Math.round(Math.random()*999999999);
  const returnUrl = 'http://localhost:3000/transbank/result';
  var finalUrl = 'http://localhost:3000/transbank/result';
  
  transaction.initTransaction(amount, buyOrder, sessionId, returnUrl, finalUrl)
    .then((response) => {
      const token = response.token;
      const url = response.url;
      const data = {'token_ws': token };
      const options = {
        method: 'POST',
        headers: { 'content-type': 'application/x-www-form-urlencoded' },
        data: qs.stringify(data),
        url,
      };
      axios(options)
      .then(function (response) {
        res.write(`${response.data}`)
        res.end('')
      })
      .catch(function (error) {
        console.log(error);
      });

    
    
      //   const form = new FormData();
    //   form.append('token_ws', token);
    //   axios.post(url, form, { headers: form.getHeaders() })
      // .then(function (response) {
      //   console.log(response);
      //   res.write(`${response.data}`)
      //   res.end('')
      // })
      // .catch(function (error) {
      //   console.log(error);
      // });


    console.log(token," " +url);
    })
    .catch((error) => {
        console.log(error.toString())
    });

});




module.exports = router;
