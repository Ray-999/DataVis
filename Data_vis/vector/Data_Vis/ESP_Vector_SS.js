const express = require('express');
const app = express();
const mysql = require('mysql');

const con = mysql.createConnection({
    host: "10.11.90.16",
    user: "AppUser",
    password: "Special888%",
    database: "ESP2"
});

//SQL
app.get('/ESP', function (req, res) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    con.query("SELECT * FROM StationData", function (err, result){
        res.send(result);
    });
});

app.get('/ESP2', function (req, res) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    const longitude = req.query.longitude;
    const latitude = req.query.latitude;
    con.query("SELECT State, City FROM StationData WHERE Latitude = ? AND Longitude = ?",[latitude, longitude], function (err, result){
        res.send(result);
    });
});
app.listen(6969);