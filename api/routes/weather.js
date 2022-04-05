var express = require("express");
const https = require('https');
const API_KEY = "bbf20eda4ec94a38ac905343220504";

var router = express.Router();
router.get("/:zipcode", function(req, res, next) {
    https.get('https://api.weatherapi.com/v1/forecast.json?key='+API_KEY+'&q='+req.params.zipcode+'&days=3&aqi=no&alerts=no', (resp) => {
    let data = '';
    resp.on('data', (chunk) => {
        data += chunk;
    });
    resp.on('end', () => {
        if(JSON.parse(data).error){
            res.statusCode = 401;
            res.send(JSON.parse(data));
            console.log("BAD INPUT STRING: "+JSON.parse(data).error.message);
        }else{
            console.log(data);
            res.send(data); 
        }
    });
    }).on("error", (err) => {
        res.statusCode = 401;
        res.send('None shall pass');
        console.log("Error: " + err.message);
    });
    
});

module.exports = router;