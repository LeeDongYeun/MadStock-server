var express = require('express');
var du = require('date-utils');
var fs = require('fs');
const path = require('path');
const timePath = path.resolve('res', 'time.txt');
function updater(){
  var serverTime = new Date();
  serverTime =serverTime.toFormat('YYYY-MM-DD');
  console.log('server time: '+serverTime);
  var data = fs.readFileSync(timePath, 'utf8');
  console.log('Last Update: '+data);
  if(serverTime != data){
    console.log('we need to update');
    const scriptPath = path.resolve('scripts', 'article_scraper.py');
    pyShell = require('python-shell');
    pyShell.PythonShell.run(scriptPath, null, function(err, results){
      if(err) throw err;
      else {
        console.log('update done!');
        fs.writeFileSync(timePath, serverTime, 'utf8');
      }
    })

  }
  else{
    console.log('no need to update');
  }

}
updater();
module.exports = updater;
