const express = require('express');
const app = express();
var mysql = require('mysql');
var http = require('http');
var bodyParser = require("body-parser");
const port = 3000;
app.listen(port);

var con = mysql.createConnection({
    host: "10.11.90.16",
    user: "study",
    password: "Study1111%",
    port: "3306",
    Schema: "Study",
    Table: "challenge5Ray"
});

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());
function deleter(tra){
    // var trares = tra;
    // console.log("lll    ");
    // console.log(trares);
    for(var i=0; i<tra.length;i++){
        // console.log(tra);
        // trares[i].time=tra[i].time._nanoISO;
        delete tra[i]["ans"];
    }
    // trares.splice(-4,4);
    // console.log("fghjk    ");
    // console.log(tra);
    return tra
}

app.get ('/submit', function (req, res){
    // pets = req.query.pet;
    // console.log(pets);
    con.query("SELECT response AS ans FROM Study.challenge5Ray",function (err, result) {
        if (err) throw err;
        console.log(result);
        var ww = deleter(result);
        console.log(ww);
        console.log(result);
        // console.log(result[0]);
        // console.log(result[0].ans);
        // res.send(result[0].ans);
        res.end();
    });
    // if(pets === "spider"){
    //     res.send("I ");
    // }
    // else{
    //
    // }

});
