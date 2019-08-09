const Influx = require('influx');
const express = require('express');
const app = express();
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
    var array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
    var str = "time," + m +"\n";
    for (var i = 0; i < array.length; i++) {
        var line = "";
        for (var a = 0;a<1;a++) {
            line += array[i]["time"];
            line += ",";
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
var stations;
var life = [];

app.get('/newWind', function (req, res) {
    // console.log(req.query);
    for(var i=0; i<req.query.stationIs.length; i++) {
        var queryX = 'SELECT MEAN("X") FROM RayTest WHERE time >= ' + "'" + req.query.timeFrom + "'" + ' AND time<= ' + "'" + req.query.timeTo + "'" + ' GROUP BY time(1s) fill(none)';
        var queryY = 'SELECT MEAN("Y") FROM RayTest WHERE time >= ' + "'" + req.query.timeFrom + "'" + ' AND time<= ' + "'" + req.query.timeTo + "'" + ' GROUP BY time(1s) fill(none)';
        var queryZ = 'SELECT MEAN("Z") FROM RayTest WHERE time >= ' + "'" + req.query.timeFrom + "'" + ' AND time<= ' + "'" + req.query.timeTo + "'" + ' GROUP BY time(1s) fill(none)';
        var queryA = 'SELECT MEAN("X"), MEAN("Y"), MEAN("Z") FROM ' + req.query.stationIs[i] + ' WHERE time >= ' + "'" + req.query.timeFrom + "'" + ' AND time<= ' + "'" + req.query.timeTo + "'" + ' GROUP BY time(1s)';
        var query = 'SELECT * FROM RayTest WHERE time >= ' + "'" + req.query.timeFrom + "'" + ' AND time<= ' + "'" + req.query.timeTo + "'" + ' AND X!=\'\' GROUP BY time(1s)';
        // console.log(queryA);
        // console.log(query);
        influx.query(queryA).then
        (result => {
            // var resss = converter(result);
            // console.log(resss);
            console.log(result);
            stations = result;
            // res.send(result)
        }).catch(err => {
            res.status(500).send(err.stack)
        });
    }
    res.send(life);

    // influx.query(queryX).then
    // (result => {
    //     // var today = new Date();
    //     // var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    //     // console.log(time);
    //     // console.log(result);
    //     var resss = converter(result);
    //     console.log(resss);
    //     x_csv = convertToCSV(resss, "X");
    // }).catch(err => {
    //     res.status(500).send(err.stack)
    // });
    //
    // influx.query(queryY).then
    // (result => {
    //     var resss = converter(result);
    //     console.log(resss);
    //     y_csv = convertToCSV(resss, "Y");
    // }).catch(err => {
    //     res.status(500).send(err.stack)
    // });
    //
    // influx.query(queryZ).then
    // (result => {
    //     var resss = converter(result);
    //     console.log(resss);
    //     z_csv = convertToCSV(resss, "Z");
    // }).catch(err => {
    //     res.status(500).send(err.stack);
    //     // console.log(err)
    // });
    //
    // // res.setHeader("Access-Control-Allow-Origin", "*");
    // //
    // // influx.query(myStat, function (err, result, fields) {
    // //     var status = [{errStatus: ""}];
    // //
    // //     if (err) {
    // //         console.log(err);
    // //         status[0].errStatus = "fail";
    // //         res.send(status);
    // //         res.end();
    // //     } else if (result.length === 0) {
    // //         status[0].errStatus = "no data entry";
    // //         res.send(status);
    // //         res.end();
    // //     } else {
    // //         var Wind_Speed = [];
    // //
    // //         Wind_Speed = JSON.stringify(result, null, "\t");
    // //         console.log(Wind_Speed);
    // //         res.send(Wind_Speed);
    // //         res.end();
    // //     }
    // // }).then(result => {
    // //     console.log(result.length);
    // //     res.send(result)
    // // }).catch(err => {
    // //     res.status(500).send(err.stack)
    // // });
    //
    // const date    = new Promise(function(resolve, reject) {
    //     console.log(x_csv);
    //     console.log(!!x_csv);
    //     console.log(y_csv);
    //     console.log(!!y_csv);
    //     console.log(z_csv);
    //     console.log(!!z_csv);
    //     if (!!x_csv&&!!y_csv&&!!z_csv) {
    //         life[0]=x_csv;
    //         life[1]=y_csv;
    //         life[2]=z_csv;
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
app.get('/render', function (req, res) {
            res.render('/historical.html');
        });


app.listen(3000);