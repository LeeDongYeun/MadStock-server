var express = require('express');
var router = express.Router();
var dateFormat = require('dateformat');
var Crawler = require("crawler");

/* GET home page. */
router.post('/', function(req, res, next) {

    console.log(req.body); 
    var action = req.body.result.action;
    console.log('requested action: ' + action);
    if(action == 'stock_info'){
        var market = req.body.result.parameters.Stocks;
        var reqDate = dateFormat(req.body.result.parameters.date, "fullDate");
        console.log('market: '+ market);
        console.log('date: '+reqDate);
        if(reqDate == dateFormat(new Date(), "fullDate")){//today
            var c = new Crawler({
                maxConnections : 10,
                // This will be called for each crawled page
                callback : function (error, res2, done) {
                    if(error){
                        console.log(error);
                    }else{
                        var $ = res2.$;
                        // $ is Cheerio by default
                        //a lean implementation of core jQuery designed specifically for the server
                        if(market == "KOSPI"){
                            var price = $("#KOSPI_now").text();
                            var change = $("#KOSPI_change").text();
                            console.log('change: '+change);
                            res.json({ 'speech': '오늘의 '+market+' 지수는 어제보다 '+change+'한 '+price + '입니다', 'displayText': 'tomorrow' });
                        }
                        else if(market == "KOSDAQ"){
                            var price = $("#KOSDAQ_now").text();
                            var change = $("#KOSDAQ_change").text();
                            console.log('change: '+change);
                            res.json({ 'speech': '오늘의 '+market+' 지수는 어제보다 '+change+'한 '+price + '입니다', 'displayText': 'tomorrow' });
                        }
                        else{
                            var price = $("#KPI200_now").text();
                            var change = $("#KPI200_change").text();
                            console.log('change: '+change);
                            res.json({ 'speech': '오늘의 '+market+' 지수는 어제보다 '+change+'한 '+price + '입니다', 'displayText': 'tomorrow' });
                        }
                    }
                    done();
                }
            });
            c.queue('https://finance.naver.com/sise/');
           // res.json({ 'speech': msg[0], 'displayText': 'tomorrow' });
        }
        else{//tomorrow
            res.json({ 'speech': 'hell', 'displayText': 'tomorrow' });
        }
    }
    
});

module.exports = router;
