var express = require('express');
var router = express.Router();
var dateFormat = require('dateformat');
var Crawler = require("crawler");
var util= require('util');
var yahooFinance = require('yahoo-finance');

/* GET home page. */
router.post('/', function(req, res, next) {
    var serverTime = new Date();
    console.log(req.body); 
    var action = req.body.queryResult.action;
    if(action == 'stock_info'){
        var market = req.body.queryResult.parameters.Stocks;
        var reqDate = dateFormat(req.body.queryResult.parameters.date, "fullDate");
        console.log('market: '+ market);
        console.log('date: '+reqDate);
        if(reqDate == dateFormat(serverTime, "fullDate")){//today
            console.log('here today');
            yahooFinance.historical({
                symbol: 'AAPL',
                from: '2019-01-01',
                to: '2019-01-02',
                // period: 'd'  // 'd' (daily), 'w' (weekly), 'm' (monthly), 'v' (dividends only)
              }, function (err, quotes) {
                    console.log(quotes);
              });
        }
        else{//tomorrow
            console.log('tomorrow never knows');
            res.json({ 'speech': 'hell', 'displayText': 'tomorrow' });
        }
    }
    
});

module.exports = router;
