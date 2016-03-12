/*//Set margins
var margin = {top: 40, right: 20, bottom: 30, left: 40},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

//Parse the date and time from JSON
var formatPercent = d3.format(".0%");

var x = d3.scale.ordinal()
    .rangeRoundBands([0, width], .1);

var y = d3.scale.linear()
    .range([height, 0]);

var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left")
    .tickFormat(formatPercent);

var tip = d3.tip()
    .attr('class', 'd3-tip')
    .offset([-10, 0])
    .html(function(d) {
        return "<strong>Frequency:</strong> <span style='color:red'>" + d.frequency + "</span>";
    })

var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

svg.call(tip);

d3.tsv("data.tsv", type, function(error, data) {
    x.domain(data.map(function(d) { return d.letter; }));
    y.domain([0, d3.max(data, function(d) { return d.frequency; })]);

    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("Frequency");

    svg.selectAll(".bar")
        .data(data)
        .enter().append("rect")
        .attr("class", "bar")
        .attr("x", function(d) { return x(d.letter); })
        .attr("width", x.rangeBand())
        .attr("y", function(d) { return y(d.frequency); })
        .attr("height", function(d) { return height - y(d.frequency); })
        .on('mouseover', tip.show)
        .on('mouseout', tip.hide)

});

function type(d) {
    d.frequency = +d.frequency;
    return d;
}*/

//Width and height
var margin = {top: 40, right: 20, bottom: 30, left: 40},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

var urlLink = "https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/GDP-data.json";

var dataset = [];

//ToDo set scale for x and y

//Todo figure out yScale -> think it has to do with ordinal scale

var gdpDataset = [];


d3.json(urlLink, function(error, json) {
        for(var i = 0; i < json.data.length; i++) {
            var tempDate = json.data[i][0];
            var tempGDP = json.data[i][1];
            dataset.push({"date": tempDate, "GDP": tempGDP});
        }

        //Width and height
        var w = 500;
        var h = 100;
        var barPadding = 1;


        for(var i = 0; i < dataset.length; i++) {
            gdpDataset.push(dataset[i].GDP);
        }

        //Create scales
        var yScale = d3.scale.linear()
            .domain([0, d3.max(gdpDataset, function(d) {
                return d;
            })])
            .range([h, 0]);

        /*var xScale = d3.scale.linear()
            .domain([h, d3.max(dateDataset, function(d) {
                return d;
            })])*/

        //Create SVG element
        var svg = d3.select("body")
            .append("svg")
            .attr("width", w)
            .attr("height", h);

        svg.selectAll("rect")
            .data(dataset)
            .enter()
            .append("rect")
            .attr("x", function(d, i) {
                return i * (w / dataset.length);
            })
            .attr("y", function(d, i) {
                return h - yScale(dataset[i].GDP);
            })
            .attr("width", w / dataset.length)
            .attr("height", function(d, i) {
                return yScale(dataset[i].GDP);
            })
            .attr("fill", function(d) {
                return "rgb(0, 0, " + (d * 10) + ")";
            });
    }
);
