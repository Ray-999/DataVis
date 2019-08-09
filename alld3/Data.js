chart = {
    const svg = d3.select(DOM.svg(width, height))
        .style("-webkit-tap-highlight-color", "transparent")
        .style("overflow", "visible");

svg.append("g")
    .call(xAxis);

svg.append("g")
    .call(yAxis);

svg.append("path")
    .datum(data)
    .attr("fill", "none")
    .attr("stroke", "steelblue")
    .attr("stroke-width", 1.5)
    .attr("stroke-linejoin", "round")
    .attr("stroke-linecap", "round")
    .attr("d", line);

const tooltip = svg.append("g");

svg.on("touchmove mousemove", function() {
    const {date, value} = bisect(d3.mouse(this)[0]);

    tooltip
        .attr("transform", `translate(${x(date)},${y(value)})`)
        .call(callout, `${value.toLocaleString(undefined, {style: "currency", currency: "USD"})}
${date.toLocaleString(undefined, {month: "short", day: "numeric", year: "numeric"})}`);
});

svg.on("touchend mouseleave", () => tooltip.call(callout, null));

return svg.node();
}


height = 500;
margin = ({top: 20, right: 30, bottom: 30, left: 40});
x = d3.scaleUtc()
    .domain(d3.extent(data, d => d.date))
    .range([margin.left, width - margin.right]);
y = d3.scaleLinear()
    .domain([0, d3.max(data, d => d.value)]).nice()
    .range([height - margin.bottom, margin.top]);
xAxis = g => g
    .attr("transform", `translate(0,${height - margin.bottom})`)
    .call(d3.axisBottom(x).ticks(width / 80).tickSizeOuter(0));
yAxis = g => g
    .attr("transform", `translate(${margin.left},0)`)
    .call(d3.axisLeft(y))
    .call(g => g.select(".domain").remove())
    .call(g => g.select(".tick:last-of-type text").clone()
        .attr("x", 3)
        .attr("text-anchor", "start")
        .attr("font-weight", "bold")
        .text(data.y));
callout = (g, value) => {
    if (!value) return g.style("display", "none");

    g
        .style("display", null)
        .style("pointer-events", "none")
        .style("font", "10px sans-serif");

    const path = g.selectAll("path")
        .data([null])
        .join("path")
        .attr("fill", "white")
        .attr("stroke", "black");

    const text = g.selectAll("text")
        .data([null])
        .join("text")
        .call(text => text
            .selectAll("tspan")
            .data((value + "").split(/\n/))
            .join("tspan")
            .attr("x", 0)
            .attr("y", (d, i) => `${i * 1.1}em`)
            .style("font-weight", (_, i) => i ? null : "bold")
            .text(d => d));

    const {x, y, width: w, height: h} = text.node().getBBox();

    text.attr("transform", `translate(${-w / 2},${15 - y})`);
    path.attr("d", `M${-w / 2 - 10},5H-5l5,-5l5,5H${w / 2 + 10}v${h + 20}h-${w + 20}z`);
};
