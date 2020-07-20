var Transbank = require('transbank-sdk');
var qs = require('qs');
var axios = require('axios');
var {cCode,env,publicK,privateK, webPayCrt} = require('./webPayConfig');

class webPayNorm{

  constructor(publicKey,privateKey,webPayCert,commerceCode, env){
        this.publicKey = publicKey;
        this.privateKey = privateKey
        this.webPayCert = webPayCert;
        this.commerceCode = commerceCode;
        this.env = env;
        
        //configuration
        this.configuration = new Transbank.Configuration();
        this.configuration
            .withPublicCert(publicKey)
            .withPrivateCert(privateKey)
            .withCommerceCode(commerceCode);

        // test environment or production
        this.env === 'test' ? this.configuration = Transbank.Configuration.forTestingWebpayPlusNormal() : this.configuration;
        this.transaction = new Transbank.Webpay(this.configuration).getNormalTransaction();   

    }

    static getHtmlTransitionPage(urlRedirection, token_ws, gifUrl){
        gifUrl = gifUrl || 'data:image/gif;base64,R0lGODlhZABkAMQAAAAAAP////z8/Pj4+PX19fHx8e7u7uvr6+fn5+Pj4+Dg4N3d3dra2tbW1tLS0s/Pz8zMzP///wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH5BAEAABEALAAAAABkAGQAAAX/ICSO5LgURwMpAmIcJdko40E8UIPHo1LELNXoQRMhYA3BIUEo8iAJxKiQeK6KCQMjIXCsAgtrTuAs3MSjAQP4qwkG4YdA9YiuxdERo81jCHB/EAcKC153PA0qSUUHCzs8D14rMDGPEA5wBAUzfGg0SUILBmIGVQEPgxClYg4Hc2MJTGhcKRADkmJLKy0EYWgLSrsICgNCJIUiDl2uRQW+fQQJroovliQPCAMJdQMolCUPVCIPtxB1b2gvCQMwDAcIuCMOAUo4WQ+aWd88ziJBaKoQLGDnb0CgGAwIEFgjTd4zaOMI7OOxhEsVNVCGoekngsArKw1+OCBAUEQsKywQ/5AzhiahiQATSyiLZEAbAYAjmOyIdhPlqIUMAoyCsEcMNiWdjJIRsSDbwxUFJOUh6tEJIgMGwhzQdgAGAZYyHTRsdUccGgcFAsQDl61KkiVfRYFLEGCbHFwKrMnoxSLMgpPkeCQooBLKgQdahuBMRkogQbEJVJyM4aAmAwVDAWad5MCXgnVWjSRgYKBLA4OhSww+sBZNyEskKWGzsQMs0QGWcTpTACOLv8gx1tVI+sQAAncfcWKGAFTopckiUAgOZmULEepTrRw4NS4AwAY9oRC34kAsDLJP8KXXmxOFiq1RzqA5YACHHDQPXI7wPouwvcOJWRFOaqwM4I8zTW0jk/99gxUGXxNiEAPBUuYIgAYCo5XmwGkURlgSTnssQBJd7EFxAwLH1YTDNBEm9pYCEFohnAgHjAdOjVXIcQhACBRQxAAlCkLScDTKx4MCARThwBE7UsSdOfwJ2ISIJlWxmAgMtCJFLk8+EKUuCPmT3GL02WdhJUPl8RoEGF5JYws4lVmhYjxIJKZt4LD0IIEQiBNFSHXoZMUJAS7W4Io28XmNnbu0RoIPJbD4RBKRBFAADqUEOdgWHaaTYU+uONqDEPhQ0iQPGJFA2zVOHCGMlWIc5EeQrOVwUzgNWHlqCf9UGNM1kvAWA5hvwlGhIm2i8WSfu5r0Q0K4TojnMTj0mor/jEqoUM41MmWyCaQAOaLKN18JiNEAxVQYpK1nsIDZlkat4w1AuqTUi2sKPYCPjy8cucNAY8ClqHiDnXECrJTlVtBB15hFjhfnGCgjFWbomwWBLAhgpTh1HKfsDqsaFQ2SVkFHQkILGeaQGE+GbAUcNRXCMEBdBmCkYFWckKQeNgqz0mI138wGVSjAC5B05hRgXC4JYFJHXdEhXAkCSC2GdDhLR1pYn54NoJYYJ6Sw72B5nTkpYjR8RipOaH39xDoqje3jfTKVRgMDEpszcBacOkBEAmGQVgmO0Skw0rrkTbzHDX8HnlkJCUVFLBqBDIJMRumW4KOIN7GQOSQ4Il4C/5DMVWxSNtOapATpNKNCwyqBWlNHG/hIDUk0JwhNnoUYykGA37GIjs3O1W3DTHRPgaOQCT3nBK9ZIJ4mwmZuMjax2Pn0i180TD0OSXZFGUVf4DeYHAOhzT6ByYF/aVSCEK1wnM/nFKXwkVxi+JhSOAEYHVwBnBoY5JwxomVpziuEIMAo8KE7EggqJcRI3exEkIT0kUBWM7uQj0TAukookHbcKxWXJOEOeIgsPMkSEASWBcDqZekdJ2ReRHZ1B5fhpHaiEUMSKkOu1D3BFf67nZXwZw4eKIMRDZTBI0qFgCQSpU37wsyv2lOrxaBCflSg36QoZIP5IEwOUxzBW8Zxsf/GIMeHQ5gSAaSwr3UpaAxFsOAlZraIs8FxMeBpj4DSJIWQOIAGD0BjyIIyML/RKDSnYU8TcVBHgOhHBFHiRxX+dKkkAASJOFhS8lSlsfLkjU4UOUMSNtkDEVCIblus1KWo8gvq2ABGpCRBK5AiwBnUQJRBAgYSlACj1BBhBK5KyTp8qI6SDCaWkZPEOZp3x+g4cVzrOA+TKPKGOLyiARgSFZZ6IkLXwIFqLNnEpBTBRXE9QT/dJI+3OHGlRy4AJulYQ4+SY75ksCgJsQjPOcPzzjDSqAr2iiU4KNQUY72sASfokwDWoCOEROOe1cAPQZ0CDoeVI2K/cM9bmIBQ70H/bkJeaMQO2MORXuFhACrZaFw8ijKGfKMzeNACF8oTC8nYrgFY8YVawpe/Z3jEh5uqGGRs+oT9adEKlSMExI4gNLQsICVsspToBMUcWbwMB5o4w2yceJQaAc11qqgCZBCSrAp+J6eC4IpXpqUMNm1DAL8bK0Daps0rCIJCHNkivFJoBb4IwC+A+SRCpKcKgSbOCi84zNi0p8OF5tAoYeANTFcAmvO5hyqBwgMK6goEGNTBALlynwywhNa3LFJKhBCWbyhrG1FsAQz8CyIJjHPGK0WBBSjQ5zXIMJKnaixg8foBdmTbgwCxQHR5dNaVEJOYkYBEAKsYwxoaeTsDwee0/ygBwwhSZpRHrrB6ECjEvZ67VyslshJ0kMgCEiQ6YkiiXCgx0CnNZkWSCFC6jy3i+V6BDwOi91EtYOyRXMTLGIGOCqIbAuFM+8w7maODR0oKyTxBvCUdIH21y12C8ZHAPsJJQLD6B3FJkKoejOlkDsZJdqCHptPlICqfCFJeGAWFEwPLHzEBVwwYZVI8wIunkswIoCwJtnrwGDhvy5YtWlOibrKgrp+4n0dl8Id5rNK7MSjmYRToXvzIqyuXJBWjLKhLYUSwEq2CgTCPqgduSgQVoE1PW3pgEMT1CozpWAJBSugoVxhLDshqmhjcCc/GDGQf9TRBtT5yrX1GxJ+XWP+njgEihyIUNJavGcmHgLyXdpEha9XhZ6G1A1BeGPZQKu2oT5jDgKAMhcXtKRgODkbpiRp0CBaFGBcEW4JSkOYmQ4WC7eRhnktceBxPaFmDsaGNgHGUiG1OWUOSgelbbcJKW9XLoQyDGDmucKQ2W5dxDv0c4CTaZ2x2aLReIdcSYIg0pkGNbmSjtBFnOjbjYGqQusrMNKRLDm7Mm1fD5R65lW3VzRlFu1mRFm3WYbpKYIIAtwNugPBtpo0jypSTUWz0gNfha9xSx7wtiPrMiXIrUurpjrptaXRbQKFzUypacRiQkNbke2pdKmAXvBi8W0McUlSGTWe1z8CEMOnhLV//SCepotLgeFw7KZEs/rxhT2qzK7A3dK00cBvOtiv6yh6kKd4dSoOv3+Bo9bb0WvZ/HsmzWQjtfUtupvnYLxQbr84A4NtYhpqtRLcVQG7xo6dE4cHTw0i3OWKOx9IqwcB7bK5uh8ZJQbqNz1ICHNERsSXw+DYMO3STeA1riyZ5XQ9FSnBGpmD1Cq1hM5IFvZvwMQChBysmk5MHFxvsYiw1bzBcU23enVVFQyl57cjeIhIhOwa8x6ABh2gCCyiRHR7Qtuk3/DKkoVAbCmGYLmlrwZlHJ3gV4A0V2sAuIsID/LMobAV1RomQdkBIkaFoKZgHggGmj4qc9W7Q+hRJQjRh/zlhdWW2KprkYxTUKU+gBuewDpy1AqZUBKj0NjmTFk7AadOjZzDwSuMlI3tFPHtxB/pRGdQxKMHwIpBHEU0DJHSxMbaDTnZyTI70ERjSBUAAXV6wQVhCTBx4CdPkGmjDWskHOaIGaZWBESnRI9gwbA/oNCDiZtt3RRtjOMtma7FUOxOWKwoiTupjBrDmaEwxak+wOcvjOakTNokQcSslIxdIPNiENIOGLqwwDliYHu2HQ7MgU10QbOcmCC34NFWwBaQnD6HWbKkGbYvCT/2WVMiQbSAxhGoDXmhwC+Tmh62nh4rIA6ewc2KVaFRYOIcDEgbAg1eyUJomG/pGQfaERXvDRC94ZVhm2DlvkDqn8VQfohxm0GrOsXDSoUYLlC8RAkhiF1wR0XpDQD0NJXPG1iz4UIrHaA40lmVgdzoCxEAyhFp59Yc/9HJSwogz9HbmEHfLxT3hlXcTRFV8hRPytj1DlBmANwyC10U6tETzI0FDklb5FCQ4ZYoQEAIAOw==';
    return `<html><head><style>
        html,body { margin: 0; padding: 0; height: 100%; width: 100%; background-image: url(${gifUrl}); }
        form { display: none;}</style></head>
        <body onload="document.getElementById('form').submit();">
        <form action="${urlRedirection}" method="post" id="form"><input name="token_ws" value="${token_ws}"></form></body></html>`;
    }

    userRedirect = async (token,url) => {
        let options = {
            method: 'POST',
            headers: { 'content-type': 'application/x-www-form-urlencoded' },
            data: qs.stringify({'token_ws': token }),
            url
        };
      return await axios(options);
      }
      
        //Sending initial request to the Transbank
        //getCallback the url and token      
        init = async (req,res) => {
        let amount = req.body.amount;
        let sessionID = req.sessionID;
        let mainurl = 'http://' + req.get('host') + req.baseUrl;
        let returnUrl = mainurl + '/second';
        let finalUrl = mainurl + '/finish';
        let buyOrder = Date.now();
        try{
            const promiseTransaction = await this.transaction.initTransaction(amount, buyOrder, sessionID, returnUrl, finalUrl);
            const token = promiseTransaction.token;
            const url = promiseTransaction.url;
            const newRedirectionUrl = await this.userRedirect(token,url);
            console.log(newRedirectionUrl);
            res.end(newRedirectionUrl.data);
        }catch(error){
            res.json({
            "errorMessage": error.message
            })
        }
        }

        cbTransaction = async (req,res) => {
            try{            
            const token = await req.body.token_ws;
            let result = await this.transaction.getTransactionResult(token)
            if(result.detailOutput[0].responseCode === 0){
                req.session.buyOrder = result.buyOrder;
                req.session.cardDetail = result.cardDetail;
                req.session.amount = result.detailOutput[0].amount;
                req.session.transactionDate = result.transactionDate;
                req.session.paymentTypeCode = result.detailOutput[0].paymentTypeCode;
            
                const url = result.urlRedirection;
                res.send(webPayNorm.getHtmlTransitionPage(url, token));
            }else{
                res.json({
                    "error": "Response code is not 0 :: not successful transaction" 
                })
            }            
        }catch(e){
            res.json({
                'error': e.message
            })
        }
            
        }

        finishTransaction = async (req,res) => {
            try{
                res.json({
                    "success": true,
                    "buyOrder": req.session.buyOrder,
                    "amount": req.session.amount,
                    "Credit card details": req.session.cardDetail,
                    "date": req.session.transactionDate
                })
            }catch(e){
                res.json({
                    "success": false,
                    "error:": e.message
                })
            }
        }
    
      //Just For the demonstration
      indexJustForDemonstration = (req,res) => {
        let mainurl = 'http://' + req.get('host') + req.baseUrl + '/init';
        res.render('index.html', {mainurl});
      }


    }


var transaction = new webPayNorm(publicK,privateK,webPayCrt,cCode,env);

module.exports = transaction;