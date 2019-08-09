const Influx = require('influx');
const express = require('express');
const path = require('path');
const os = require('os');
const bodyParser = require('body-parser');
const app = express();
const port = 8086;
app.listen(port);

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// parse application/json
app.use(bodyParser.json());

var influx = new Influx.InfluxDB({
    "host" :"10.11.90.15",
    "port" :"8086",
    "username" :"rayf",
    "password" :"rayf",
    "database" :"RayESP"
});

app.post('/submit', function (req, res){
    IDs = req.body.ID;
    Password = req.body.Password;
    influx.query(`
    select X as "X",
    Y as "Y" from cpu
    where time > now() - 0.016h and
    host = ${Influx.escape.stringLit(os.hostname())}
    group by time(10s)
    order by time desc
    limit 200
    `)
        .then(result => response.status(200).json(result))
        .catch(error => response.status(500).json({ error }));
});