var api = 'https://api.coindesk.com/v1/bpi/historical/close.json?start=2017-12-31&end=2018-04-01';
document.addEventListener("DOMContentLoaded", function(event) {
    fetch(api)
        .then(function(response) { return response.json(); })
        .then(function(data) {
            var parsedData = parseData(data);
            drawChart(parsedData);
        })});

function parseData(data) {
    var arr = [];
    for (var i in data.bpi) {
        arr.push(
            {
                date: new Date(i),
            //date
                value: +data.bpi[i]
            // convert string to number
            });
    }
    return arr;
}

function drawChart(data) {
    var svgWidth = 600, svgHeight = 400;   var margin = { top: 20, right: 20, bottom: 30, left: 50 };   var width = svgWidth - margin.left - margin.right;   var height = svgHeight - margin.top - margin.bottom;
    var svg = d3.select('svg')     .attr("width", svgWidth)     .attr("height", svgHeight);