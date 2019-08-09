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

function converter(result){
    var trares = result;
    for(var i=0; i<result.length;i++){
        trares[i].time=result[i].time._nanoISO;
    }
    return trares
}

var pastTime = "4m";
var nowTime = "2m";
var queryX = 'SELECT MEAN("X") FROM RayTest WHERE time >= now() - ' + pastTime + ' AND time<=now() - '+ nowTime + ' GROUP BY time(1s)';
var queryY = 'SELECT MEAN("Y") FROM RayTest WHERE time >= now() - ' + pastTime + ' AND time<=now() - '+ nowTime + ' GROUP BY time(1s)';
var queryZ = 'SELECT MEAN("Z") FROM RayTest WHERE time >= now() - ' + pastTime + ' AND time<=now() - '+ nowTime + ' GROUP BY time(1s)';
console.log(queryX);
// var queryX = "SELECT MEAN(\"X\") FROM ar WHERE time>'2019-07-23T20:25:00Z' AND time<'2019-07-23T20:29:00Z' GROUP BY time(1s)";
// var queryY = "SELECT MEAN(\"Y\") FROM ar WHERE time>'2019-07-23T20:25:00Z' AND time<'2019-07-23T20:29:00Z' GROUP BY time(1s)";
// var queryZ = "SELECT MEAN(\"Z\") FROM ar WHERE time>'2019-07-23T20:25:00Z' AND time<'2019-07-23T20:29:00Z' GROUP BY time(1s)";
var x_csv,y_csv,z_csv;
var life = [];

app.get('/query', function (req, res) {
    // DATA EXISTS BUT IT SAYS IT DOESN'T \\
    influx.query(queryX).then
    (result => {
        var today = new Date();
        var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
        console.log(time);
        // console.log(result);
        // result = result.slice(Math.max(result.length - 60, 1));
        // result = result.slice(0,3001);
        // console.log(result);
        var resss = converter(result);
        x_csv = convertToCSV(resss, "X");
        //
        // console.log(resss);

        // // console.log(resss.length);
        // var xa = average(resss,"X");
        // // console.log(xa);
        // // console.log(resss);

        // var ya = average(resss,"Y");
        // // console.log(ya);
        // // console.log(resss);
        // var y_csv = convertToCSV(ya, "Y");
        // var za = average(resss,"Z");
        // var z_csv = convertToCSV(za, "Z");
        // console.log("avg run");
        //
        // var life = [];
        // life[0] = x_csv;
        // life[1] = y_csv;
        // life[2] = z_csv;
        // console.log(x_csv);
        // console.log(y_csv);
        //
        // console.log(z_csv);

        // res_x.send(x_csv)

    }).catch(err => {
        res.status(500).send(err.stack)
    });

    influx.query(queryY).then
    (result => {
        result = result.slice(Math.max(result.length - 60, 1));
        var resss = converter(result);
        y_csv = convertToCSV(resss, "Y");
        // console.log(y_csv);
        //     // life[1] = y_csv
        //     // res_y.send(y_csv)
    }).catch(err => {
        // res.status(500).send(err.stack)
    });
    //
    influx.query(queryZ).then
    (result => {
        result = result.slice(Math.max(result.length - 60, 1));
        var resss = converter(result);
        z_csv = convertToCSV(resss, "Z");
        // console.log(z_csv);
        // res_z.send(x_csv, y_csv, z_csv)
        //
        //     // life[0] = x_csv;
        //     // life[1] = y_csv;
        //     // life[2] = z_csv;
        //     // console.log(life);
        //     // res.send(life)
        const date    = new Promise(function(resolve, reject) {
            if (x_csv!==null&&y_csv!==null&&z_csv!==null) {
                life[0]=x_csv;
                life[1]=y_csv;
                life[2]=z_csv;
                resolve(life);
                console.log(x_csv);
                console.log(y_csv);
                console.log(z_csv);
            } else {
                reject(new Error('Bad'))
            }
        });
        date
            .then(function(done) {
                // console.log(life);
                // res.send(life);
                res.send(done);
            })
            .catch(function(error) {
                print(error.message);
            });
    }).catch(err => {
        // res.status(500).send(err.stack)
        console.log(err)
    });







});
app.listen('8008');