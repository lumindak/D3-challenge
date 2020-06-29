// @TODO: YOUR CODE HERE!

//creating SVG objects
////////////////////////
// svg container
var svgHeight = 400;
var svgWidth = 900;

// margins
var margin = {
  top: 50,
  right: 10,
  bottom: 50,
  left: 50
};

// chart area minus margins
var chartHeight = svgHeight - margin.top - margin.bottom;
var chartWidth = svgWidth - margin.left - margin.right;

// create svg container
var svg = d3.select("#scatter").append("svg")
  .attr("height", svgHeight)
  .attr("width", svgWidth);

var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`)



d3.csv("./assets/data/data.csv").then(function(healthData,err) {
  if (err) throw err;
 // Format the data
healthData.forEach(function(data) {
    data.healthcare = +data.healthcare;
    data.poverty = +data.poverty;
    data.age = +data.age;
    data.obesity = +data.obesity;
    data.smokes = +data.smokes;
    data.age = +data.age;
    data.income = +data.income;
  });

var min_max_y = d3.extent(healthData, d => d.healthcare);
var y_min = min_max_y[0];
var y_max = min_max_y[1];

var min_max_x = d3.extent(healthData, d => d.poverty);
var x_min = min_max_x[0];
var x_max = min_max_x[1];

//console.log(min_max_x);

var x = d3.scaleLinear()
  .domain([x_min-1,x_max+1])
  .range([0,chartWidth]);
  console.log(healthData);
  //console.log(d3.extent(healthData, d => d.healthcare));



var y = d3.scaleLinear()
  .domain([y_min-1, y_max+1])
  .range([chartHeight,0]);
 
var bottomAxis = d3.axisBottom(x);
var leftAxis = d3.axisLeft(y);

chartGroup.append("g")
    .attr("transform", `translate(0, ${chartHeight})`)
    .call(bottomAxis);

chartGroup.append("g").call(leftAxis);


var circlesGroup = chartGroup.selectAll("circle")
    .data(healthData)
    .enter()
    .append("circle")
    .attr("cx", d => x(d.poverty))
    .attr("cy", d => y(d.healthcare))  
    .attr("r", "15")
    .attr("fill", "blue")
    .attr("opacity", ".5");


  

//method 2
//it's important to have "chartGroup.selectAll()" not chartGroup.selectAll('text')
var text = chartGroup.selectAll()
  .data(healthData)
  .enter()
  .append("text")
  .attr("x", function(d) { return x(d.poverty)-5; })
  .attr("y", function(d) { return y(d.healthcare)+2.5; })
  .text( function (d) { return d.abbr; })
  .attr("font-family", "sans-serif")
  .attr("font-size", "10px")
  .attr("fill", "white");



   // Create axis labels
  chartGroup.append("text")
   .attr("transform", "rotate(-90)")
   .attr("y", -margin.left -5 )
   .attr("x", 0 - (chartHeight / 1.5))
   .attr("dy", "1em")
   .attr("class", "axisText")
   .text("Lacks Healthcare (%)");

  chartGroup.append("text")
   .attr("transform", "rotate(0)")
   .attr("x", chartWidth/2 )
   .attr("y", chartHeight+20)
   .attr("dy", "1em")
   .attr("class", "axisText")
   .text("In Poverty (%)");

})




