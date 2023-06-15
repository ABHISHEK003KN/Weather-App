const express = require('express');
const bodyparser = require('body-parser');
const http = require('http');
const ejs = require("ejs");

const app = express();
app.set("views","./views")
app.set('view engine', 'ejs');

app.use(bodyparser.urlencoded({extended: true}));
app.use(express.static("public"));

var city="Bengaluru";

function formatAMPM(date) {
  var hours = date.getHours();
  var minutes = date.getMinutes();
  var ampm = hours >= 12 ? 'pm' : 'am';
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  minutes = minutes < 10 ? '0'+minutes : minutes;
  var strTime = hours + ':' + minutes + ' ' + ampm;
  return strTime;
}

function getdata(url) {



}

app.get("/",function(req,response){

var url='http://api.openweathermap.org/data/2.5/forecast?q='+city+'&appid=eec195d5a50c066d06e667d410770a79&units=metric';
      const date = new Date();
      var options = {
          weekday : "long",
          day : "numeric",
          month : "long"
      };
      const day=date.toLocaleDateString("en-US",options);
      const time = formatAMPM(date);
      var parsedData;

      http.get(url, (res) => {
        const { statusCode } = res;
        const contentType = res.headers['content-type'];
      
        let error;
       
        if (statusCode !== 200) {
          error = new Error('Request Failed.\n' +
                            `Status Code: ${statusCode}`);
        } else if (!/^application\/json/.test(contentType)) {
          error = new Error('Invalid content-type.\n' +
                            `Expected application/json but received ${contentType}`);
        }
        if (error) {
          console.error(error.message);
         
          res.resume();
          return;
        }
      
        res.setEncoding('utf8');
        let rawData = '';
        res.on('data', (chunk) => { rawData += chunk; });
        res.on('end', () => {
          try {
            const parsedData = JSON.parse(rawData);
            response.render("home",{today:day,
              temp: parsedData.list[0].main.temp,
              pres: parsedData.list[0].main.pressure+" hPa",
              hum : parsedData.list[0].main.humidity+" %",
              speed : parsedData.list[0].wind.speed+" Miles/Hr",
              vis : parsedData.list[0].visibility+" Meter",
              tempmax : parsedData.list[0].main.temp_max,  
              temp1 : parsedData.list[1].main.temp,
              temp2 : parsedData.list[2].main.temp,
              temp3 : parsedData.list[3].main.temp,
              temp4 : parsedData.list[4].main.temp,
              time : time,
              city : city
            });
    
      
          } catch (e) {
            console.error(e.message);
          }
        });
      }).on('error', (e) => {
        console.error(`Got error: ${e.message}`);
      });

  
})




app.post("/",function(req,res){
     
      city=req.body.citydet;
      res.redirect("/");

  });














app.listen(3000,function(){
    console.log("server is running in port 3000");
})