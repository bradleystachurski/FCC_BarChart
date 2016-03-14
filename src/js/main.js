//Width and height
var margin = {top: 40, right: 20, bottom: 30, left: 40},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

var w = 500;
var h = 300;

var urlLink = "https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/GDP-data.json";

var dataset = [];

//ToDo set scale for x and y

//Parse date & time
var parseTime = d3.time.format("%Y-%m-%d").parse;

var dateFormat = d3.time.format("%B %Y");

//Create scales for x and y before binding data
var xScale = d3.time.scale()
    .range([0, width]);

var yScale = d3.scale.linear()
    .range([height, 0]); //Not sure why this isn't [h, 0]. Was expecting it to be.

//Just the tip...
var tip = d3.tip()
    .attr("class", "d3-tip")
    .offset([-10, 0])
    .html(function (d) {
        return "<span style='color: black'>" + dateFormat(d.date) + "<br>$" + Math.round(d.GDP).toLocaleString() + " Billion</span>"
    });

//Create axes
var xAxis = d3.svg.axis()
    .scale(xScale)
    .ticks(d3.time.years, 5)
    .tickFormat(d3.time.format("%Y"))
    .tickSize(0)
    .orient("bottom");

var yAxis = d3.svg.axis()
    .scale(yScale)
    .orient("left");

//Create SVG element
var svg = d3.select("body")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top +")");

var gdpDataset = [];


svg.call(tip);

d3.json(urlLink, function(error, json) {
        for(var i = 0; i < json.data.length; i++) {
            var tempDate = parseTime(json.data[i][0]);
            var tempGDP = json.data[i][1];
            dataset.push({"date": tempDate, "GDP": tempGDP});
        }

        for(var i = 0; i < dataset.length; i++) {
            gdpDataset.push(dataset[i].GDP);
        }

        //Add domain to scales
        xScale.domain([new Date(dataset[0].date), d3.time.year.offset(new Date(dataset[json.data.length - 1].date), 1)]);
        yScale.domain([0, d3.max(dataset, function(d) {
            return d.GDP;
        })]);

        //Create xAxis
        svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis)
        .selectAll("text")
            .style("text-anchor", "end")
            .attr("dx", "1.0em")
            .attr("dy", "1.0em")
            .attr("transform", "rotate(0)");

        //Create yAxis
        svg.append("g")
            .attr("class", "y axis")
            .call(yAxis)
        .append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 6)
            .attr("dy", ".71em")
            .style("text-anchor", "end")
            .text("US$ Billions");

        //Create bar chart from data
        svg.selectAll("bar")
            .data(dataset)
            .enter()
            .append("rect")
            .attr("class", "bar")
            .attr("x", function(d) {
                return xScale(new Date(d.date));
            })
            .attr("width", 4)
            .attr("y", function(d) {
                return yScale(d.GDP);
            })
            .attr("height", function(d) {
                return height - yScale(d.GDP);
            })
            .on("mouseover", tip.show)
            .on("mouseout", tip.hide);

        //Create Title
        svg.append("text")
            .attr("x", (width / 2))
            .attr("y", (margin.top)/8)
            .attr("text-anchor", "middle")
            .style("font-size", "30px")
            .style("font-family", "arial")
            .style("text-decoration", "none")
            .text("US Gross Domestic Product");

        svg.append("text")
            .attr("x", (width / 2))
            .attr("y", (height + (margin.bottom / 2) + 7))
            .attr("text-anchor", "middle")
            .attr("width", width)
            .style("font-size", "12px")
            .style("font-family", "arial")
            .style("text-decoration", "none")
            .text(json.description.substring(80, json.description.length));

        /*svg.selectAll("rect")
            .data(dataset)
            .enter()
            .append("rect")
            .attr("x", function(d, i) {
                return i * (width / dataset.length);
            })
            .attr("y", function(d, i) {
                return height - yScale(dataset[i].GDP);
            })
            .attr("width", width / dataset.length)
            .attr("height", function(d, i) {
                return yScale(dataset[i].GDP);
            })
            .attr("fill", function(d) {
                return "rgb(0, 0, " + 255 + ")";
            });*/

    }
);
