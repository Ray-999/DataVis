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
            measurement: 'RayTest',
            fields: {
            },
            tags: [
            ]
        }
    ]
});

function copy(resss){
    // console.log(resss);
    var copyone=[];
    for(var i=0; i<resss.length; i++){
        // console.log(resss.slice(i, i+1));
        copyone[i]=resss.slice(i, i+1)[0]
    }
    // console.log(copyone);
    return copyone
}

function convertToCSV(objArray,m) {
    var array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
    var str = "time," + m +"\n";

    for (var i = 0; i < array.length; i++) {
        var line = "";
        for (var a = 0;a<1;a++) {

            line += array[i]["time"];
            line += ",";
            // console.log(array[i][m]);
            line += array[i][m]
        }

        str += line + '\r\n';
    }

    return str;
}

function converter(result){
    var trares = result;
    for(var i=0; i<result.length;i++){
        // console.log(result);
        trares[i].time=result[i].time._nanoISO;
        // delete trares[i][m];
        // delete trares[i][n];

    }
    // trares.splice(-4,4);
    return trares
}

function deleter(tra,m,n){
    // var trares = tra;
    // console.log("lll    ");
    // console.log(tra);
    for(var i=0; i<tra.length;i++){
        // console.log(tra);
        // trares[i].time=tra[i].time._nanoISO;
        delete tra[i][m];
        delete tra[i][n];

    }
    // trares.splice(-4,4);
    // console.log("fghjk    ");
    // console.log(tra);
    return tra
}

var dateTime;
function f() {
    var today = new Date();
    var time;
    var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
    if((today.getMinutes()-2)===-1){
        time = (today.getHours()-1) + ":" + "59" + ":" + today.getSeconds();
    }
    else if((today.getMinutes()-2)===-2){
        time = (today.getHours()-1) + ":" + "58" + ":" + today.getSeconds();
    }
    else{
        time = today.getHours() + ":" + (today.getMinutes()-2) + ":" + today.getSeconds();
    }
    dateTime = "\'" + date+'T'+time+"Z" + "\'";
    console.log(dateTime);
}
f();

// var xs,ys,zs;
var json = [];
function average(res,m){
    // console.log(res);
    // console.log(m);
    var a = 1;
    var t = parseFloat(res[0][m]);
    var z;
    var x = m;
    // console.log(t);
    for(var i = 1; i < res.length; i++){
        // console.log("loop begin");
        if(i===2999){
            // console.log("I'm working");
            // console.log(res[i-1].time.substr(0,19));
            // console.log(t/a);
            // console.log(t);
            // console.log(a);
            // // console.log("n");
            // console.log(i);
            z = 59;
            // console.log(z);
            // var myjson = '{"time":'+'"'+res[i-1].time.substr(0,19)+'","'+m+'":"'+t/a+'"}';
            // var myjson = '{time:'+'"'+res[i-1].time.substr(0,19)+'","'+m+'":"'+t/a+'"}';
            // console.log("n");
            // json[z] = {'time':res[i-1].time.substr(0,19)+"',"+m+":'"+t/a+"'"};
            // json[z] = {'time':res[i-1].time.substr(0,19)+","+m+":"+t/a};
            json[z]={};
            json[z]['time']=res[i-1].time.substr(0,19);
            json[z][m] = t/a;

            // console.log("n");
            // console.log(myjson);
            a = 1;
            t = parseFloat(res[i][m]);
            // console.log("one line plug in");
            // console.log(json);
        }
        else if(res[i-1].time.substr(0,19) === res[i].time.substr(0,19) ){
            t = parseFloat(res[i][m]) + t;
            a = a + 1;
            // console.log(a);
            // console.log(parseFloat(res[i][m]));
        }
        else{
            // console.log(res[i-1].time.substr(0,19));
            // console.log(t/a);
            // console.log(t);
            // console.log(a);
            // // console.log("n");
            // console.log(i);
            z = i/50 - 1;
            // console.log(z);
            // var myjson = '{"time":'+'"'+res[i-1].time.substr(0,19)+'","'+m+'":"'+t/a+'"}';
            // var myjson = '{time:'+'"'+res[i-1].time.substr(0,19)+'","'+m+'":"'+t/a+'"}';
            // console.log("n");
            // json[z] = {'time':res[i-1].time.substr(0,19)+"',"+m+":'"+t/a+"'"};
            // json[z] = {'time':res[i-1].time.substr(0,19)+","+m+":"+t/a};
            json[z]={};
            json[z]['time']=res[i-1].time.substr(0,19);
            json[z][m] = t/a;

            // console.log("n");
            // console.log(myjson);
            a = 1;
            t = parseFloat(res[i][m]);
            // console.log("one line plug in");
            // console.log(json);
        }
        // console.log(i);
        // console.log("loop end");

    }
    // console.log("totally end");
    // console.log(json);
    return json;

}




var copyResult;

app.get('/query', function (req, res) {
    // DATA EXISTS BUT IT SAYS IT DOESN'T \\
    influx.query('SELECT "X","Y","Z","time" FROM RayTest WHERE time < dateTime', expected_response_code=3000).then
    (result => {
        // console.log(result);
        // copyResult = result;
        var resss = converter(result);
        // console.log(resss);
        // var xs = copy(resss);
        // xs[0]["Y"] = "";
        // var xs = resss;
        // var ys = copy(resss);
        // var xs = resss.concat();
        // var ys = resss.concat();
        // console.log(xs);
        // var zs = resss.concat();
        // alert( xs === resss );
        // xs[0] = {};
        var xa = average(resss,"X");
        var x_csv = convertToCSV(xa, "X");
        var ya = average(resss,"Y");
        var y_csv = convertToCSV(ya, "Y");
        var za = average(resss,"Z");
        var z_csv = convertToCSV(za, "Z");
        console.log(x_csv);
        console.log(y_csv);
        console.log(z_csv);


        console.log(xa);
        console.log(ya);




        // var x = deleter(xs,"Y","Z");
        // var y = deleter(ys,"X","Z");
        // var z = converter(result,"X","Y");
        // console.log(x[0]);
        // console.log(resss);
        // console.log(xs[0]);
        // console.log(ys);
        // console.log(copyResult);



        var life = [];
        life[0] = x_csv;
        life[1] = y_csv;
        life[2] = z_csv;


        // console.log(x_csv.length);
        // console.log(resss[0].time.substr(0,19));
        // console.log((parseFloat(resss[0].X)+parseFloat(resss[1].X)));
        // console.log(x_csv[2]);
        // console.log(x_csv[3]);
        // console.log(x_csv[4]);
        // console.log(x_csv[5]);
        // console.log(x_csv[6]);


        // res.json(resss);
        res.send(life)




    }).catch(err => {
        res.status(500).send(err.stack)
    })
});
app.listen('8008');