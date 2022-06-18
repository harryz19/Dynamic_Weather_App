const fs = require('fs');
const requests = require('requests');
const express = require('express');

var app = express();

// app.use('/static',express.static(__dirname+"/"));
const homeFile = fs.readFileSync('index.html','utf-8');

var replaceval = (temp,newdata) =>{
    let temperature = temp.replace("TEMPERATURE",newdata.main.temp);
    temperature = temperature.replace("MIN_TEMP",newdata.main.temp_min);
    temperature = temperature.replace("MAX_TEMP",newdata.main.temp_max);
    temperature = temperature.replace("COUN",newdata.sys.country);
    temperature = temperature.replace("CITY",newdata.name);
    temperature = temperature.replace("TEMP_STATUS",newdata.weather[0].main);
    return temperature;
}

app.get('/',(req,res) => {
    if(req.url == "/"){
        requests('https://api.openweathermap.org/data/2.5/weather?q=surat&units=metric&appid=d7a22859555984be77012185463fb484')
        .on('data', function (chunk) {
            var objdata = JSON.parse(chunk);
            var arraydata = [objdata];
            // console.log(arraydata);
            var finaldata = arraydata.map((value)=> replaceval(homeFile,value)).join("");
            res.send(finaldata);
            console.log(finaldata);
        })
        .on('end', function (err) {
            if (err) return console.log('connection closed due to errors', err); 
            console.log('end');
            res.end();
    });
    }
});

app.listen(8080,()=>{
    console.log('Running at 8080.');
})


