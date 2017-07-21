const express = require('express');
const fs = require('fs');
const app = express();
var logEntry = []

app.use((req, res, next) => {
    //Get current Time and turns into UTC time/Iso
    var time = new Date(Date.now(Date.UTC()));
    var isoTime = time.toISOString();
    var str = req.get("user-agent");
    var temp  = str.replace(/\,/g, "");
    
    //Pushes header request into logEntry.
    logEntry.push(
        {"Agent": temp,
        "Time": isoTime,
        "Method": req.method,
        "Resource": req.path,
        "Version": "HTTP/"+req.httpVersion,
        "Status": res.statusCode});
    
    //function the conversts from json to csv
    function ConvertToCSV(objArray) {
    var array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
    var str = '';
      for (var i = 0; i < array.length; i++) {
        var line = '';
      for (var index in array[i]) {
        if (line != '') line += ','
        line += array[i][index];
        }
        str += line + '\r\n';
      }
      return str;
    }
    
        //conversion to json
        var jsonObject = JSON.stringify(logEntry);
        
        //Appends to log.csv file into csv form!
        fs.appendFile('log.csv',ConvertToCSV(jsonObject), 'utf8', function (err){ 
         if (err) throw err;
        });
    
    console.log(ConvertToCSV(jsonObject))
    next()
   
});

app.get('/', (req, res) => {
    res.status(200).send('Ok');
});

//Gets the json data of logs to display
app.get('/logs', (req, res) => {
    // write your code to return a json object containing the log data here
    res.json(logEntry);
});

module.exports = app;
