var express = require('express');
var router = express.Router();
var dateFormat = require('dateformat');
var Crawler = require("crawler");
const path = require('path');
var client = require('cheerio-httpcli');
const sqlite3=require('sqlite3').verbose();
var du = require('date-utils');
var newDate = new Date();
var time = newDate.toFormat('YYYY년 MM월 DD일 HH24:MI 현재:')
/* GET home page. */
router.post('/', function(req, res, next) {
    //console.log(req.body); 
    console.log(time);
    var action = req.body.queryResult.action;
    if(action == 'stock_info'){
        var market = req.body.queryResult.parameters.probs.trim();
        var reqDate = req.body.queryResult.parameters.Date;
        console.log('market: '+ market);
        console.log('date: '+reqDate);
        if(reqDate == 'Today'){//today
            console.log('here today');
            const dbPath = path.resolve('res', 'stocksUtf.db');
            var db = new sqlite3.Database(dbPath ,(err) => {
                if(err){
                    console.error(err.message);
                }
                else{
                    console.log('Connected to db!');
                }
                
            });
            let sql = "SELECT code FROM utftable WHERE name  =?";
            var code;
            db.get(sql, [market], (err, row) => {
                if (err) {
                    return console.error(err.message);
                }
                else{
                    console.log('its: '+ row.code);
                    code=row.code;
                    console.log('code is :'+code);
                    

                    var url = "http://finance.yahoo.com/q/hp";
                    
                    client.fetch(url, {
                            "s": code
                    }, function(err, $, res2) {
                        if (err) {
                            console.log(err);
                            return;
                        }
                    
                        var str = $('#quote-header-info > div > div > div > span:nth-child(1)').text();
                        str = str.replace(/,/g, "");
                        str = str.substring(str.indexOf('KRW'), str.length);
                        var arr = str.match(/\d*\.\d*/);
                    
                        console.log(code);
                        console.log("Price: " + arr[0]);
                        var point = '주가는 ';
                        var sunit = '원';
                        if(market=='KOSPI' || market=='KOSDAQ' || market=='KOSPI200' || market=='DOW' || market=='NASDAQ' || market=='S&P500'){
                            point = '지수는 ';
                            sunit = '포인트' ;
                        }
                        res.json({  "fulfillmentText": time+'\n'+market+"의 "+point+arr[0]+sunit+"입니다.",
                        "fulfillmentMessages": [
                          {
                            "text": {
                              "text": [
                                time+'\n'+market+"의 "+point+arr[0]+sunit+"입니다."
                              ]
                            }
                          }
                        ],});
                    });
                    
                }
                
                
            });
            
        }
        else{//tomorrow
            console.log('tomorrow never knows');
            
        }
    }
    
});

module.exports = router;
