const Influx = require('influx');
const express = require('express');
const app = express();
var jsonexport = require('jsonexport');
const influx = new Influx.InfluxDB({
    host: '10.11.90.15',
    database: 'RayESP',
    username: "rayf",
    password: "rayf",
    schema: [
        {
            measurement: 'far',
            fields: {
                // path: Influx.FieldType.STRING,
                // duration: Influx.FieldType.INTEGER
            },
            tags: [
                // 'host'
            ]
        }
    ]
});
// var trares=[];

function convertToCSV(objArray) {
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
function converter(result){
    // console.log(result);
    var trares = result;
    for(var i=0; i<result.length;i++){
        trares[i].time=result[i].time._nanoISO;
        // console.log(trares[i])
    }
    return trares
}

var today = new Date();
var date = today.getFullYear()+'-'+(today.getMonth())+'-'+today.getDate();
var time = today.getHours() + ":" + (today.getMinutes()-1) + ":" + today.getSeconds();
var dateTime = date+'T'+time+"Z";
console.log(dateTime);


app.get('/query', function (req, res) {
    // DATA EXISTS BUT IT SAYS IT DOESN'T \\
    influx.query('SELECT "X","Y","Z" FROM far', expected_response_code=3000).then
    (result => {
        // console.log(result);

        // cs = convertToCSV(result);
        // console.log(cs);
        // res.send(cs);
        // var news = converter(result);
        // news.splice(-4,4);
        // console.log(news);
        // res.json = news;
        //
        // cs = jsonexport(result,function(err, csv){
        //     if(err) return console.log(err);
        //     console.log(csv);
        // });

        // console.log(result[0].time._nanoISO)



    }).catch(err => {
        res.status(500).send(err.stack)
    })
});
app.listen('8008');