const Influx = require('influx');
const express = require('express');
const app = express();
var jsonexport = require('jsonexport');
const influx = new Influx.InfluxDB({
    host: 'aworldbridgelabs.com',
    database: 'RayESP',
    username: "rayf",
    password: "RayESP8010",
    port: 8086,
    schema: [
        {
            measurement: 'RayTest',
            fields: {
            },
            tags: [
            ]
        }
    ]
});

function convertToCSV(objArray,m) {
    // console.log(objArray);
    var array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
    var str = "time," + m +"\n";
    for (var i = 0; i < array.length; i++) {
        var line = "";
        for (var a = 0;a<1;a++) {
            line += array[i]["time"];
            line += ",";
            // console.log(array[i][m]);
            line += array[i]["mean"]
        }
        str += line + '\r\n';
    }
    return str;
}

var x_arr = [];
var y_arr = [];
var z_arr = [];

function converter(result){
    var trares = result;
    for(var i=0; i<result.length;i++){
        trares[i].time=result[i].time._nanoISO;
    }
    return trares
}

function avg(res,len){
    var arr = res.slice(Math.max(res.length - len, 1));
    var sum = 0;
    for(var i = 0; i<arr.length; i++){
        sum = sum + arr[i].mean
    }
    var average = sum/len;
    return average
}

var pastTime = "4000m";
var nowTime = "3999m";
var queryX = 'SELECT MEAN("X") FROM RayTest WHERE time >= now() - ' + pastTime + ' AND time<=now() - '+ nowTime + ' GROUP BY time(1s)';
var queryY = 'SELECT MEAN("Y") FROM RayTest WHERE time >= now() - ' + pastTime + ' AND time<=now() - '+ nowTime + ' GROUP BY time(1s)';
var queryZ = 'SELECT MEAN("Z") FROM RayTest WHERE time >= now() - ' + pastTime + ' AND time<=now() - '+ nowTime + ' GROUP BY time(1s)';
var queryA = 'SELECT MEAN("X"), MEAN("Y"), MEAN("Z") FROM RayTest WHERE time >= now() - ' + pastTime + ' AND time<=now() - '+ nowTime + ' GROUP BY time(1s)';
console.log(queryX);
// var queryX = "SELECT MEAN(\"X\") FROM ar WHERE time>'2019-07-23T20:25:00Z' AND time<'2019-07-23T20:29:00Z' GROUP BY time(1s)";
// var queryY = "SELECT MEAN(\"Y\") FROM ar WHERE time>'2019-07-23T20:25:00Z' AND time<'2019-07-23T20:29:00Z' GROUP BY time(1s)";
// var queryZ = "SELECT MEAN(\"Z\") FROM ar WHERE time>'2019-07-23T20:25:00Z' AND time<'2019-07-23T20:29:00Z' GROUP BY time(1s)";
var x_csv,y_csv,z_csv,gx,gy,gz;
var life = [];

app.get('/query', function (req, res) {

    influx.query(queryA).then
    (result => {
        // var resss = converter(result);
        console.log(result);
        // conver(resss);
        // life[0] = x_arr;
        // life[1] = y_arr;
        // life[2] = z_arr;
        // console.log(resss);
        res.send(result);
        // var today = new Date();
        // var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
        // console.log(time);

        // gx = avg(resss,5);
        // x_csv = convertToCSV(resss, "X");
    }).catch(err => {
        // res.status(500).send(err.stack)
        console.log(err)
    });

    // influx.query(queryX).then
    // (result => {
    //     console.log(result.length);
    //     // var today = new Date();
    //     // var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    //     // console.log(time);
    //     var resss = converter(result);
    //     gx = avg(resss,5);
    //     x_csv = convertToCSV(resss, "X");
    // }).catch(err => {
    //     // res.status(500).send(err.stack)
    //     console.log(err)
    // });
    //
    // influx.query(queryY).then
    // (result => {
    //     var resss = converter(result);
    //     gy = avg(resss,5);
    //     y_csv = convertToCSV(resss, "Y");
    // }).catch(err => {
    //     // res.status(500).send(err.stack)
    //     console.log(err)
    // });
    //
    //
    // influx.query(queryZ).then
    // (result => {
    //     var resss = converter(result);
    //     gz = avg(resss,5);
    //     z_csv = convertToCSV(resss, "Z");
    //
    // }).catch(err => {
    //     // res.status(500).send(err.stack);
    //     console.log(err)
    // });
    //
    // const date    = new Promise(function(resolve, reject) {
    //     console.log(x_csv);
    //     console.log(!!x_csv);
    //     console.log(y_csv);
    //     console.log(!!y_csv);
    //     console.log(y_csv);
    //     console.log(!!y_csv);
    //     if (!!x_csv&&!!y_csv&&!!z_csv) {
    //         life[0]=x_csv;
    //         life[1]=y_csv;
    //         life[2]=z_csv;
    //         life[3]=gx;
    //         life[4]=gy;
    //         life[5]=gz;
    //         resolve(life);
    //         // console.log(x_csv);
    //         // console.log(y_csv);
    //         // console.log(z_csv);
    //         // console.log(gx);
    //         // console.log(gy);
    //         // console.log(gz);
    //     } else {
    //         reject(new Error('Bad'))
    //     }
    // });
    // date.then(function(done) {
    //     res.send(done);
    // })
    //     .catch(function(error) {
    //         console.log(error.message);
    //     });
});
app.listen('8008');