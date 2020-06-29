// By Luminda Kulasiri
//Jun. 29, 2020

//creating SVG objects
////////////////////////
// svg container
var svgHeight = 400;
var svgWidth = 900;

// margins
var margin = {
  top: 50,
  right: 10,
  bottom: 100,
  left: 100
};

// chart area minus margins
var chartHeight = svgHeight - margin.top - margin.bottom;
var chartWidth = svgWidth - margin.left - margin.right;

// create svg container
var svg = d3.select("#scatter").append("svg")
  .attr("height", svgHeight)
  .attr("width", svgWidth);

//create chaart group
var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`)

//default axes - at the beginning
var xaxis = "poverty";
var yaxis = "healthcare";

////FUNCTION DEFINITIONS START HERE/////////////////////////////

////////////////////////////////
//function to update x-axis scale
///////////////////////////////
function xScale(data, xaxis){
  var xLinearScale = d3.scaleLinear()
    .domain([d3.min(data, d => d[xaxis]) * 0.9,
      d3.max(data, d => d[xaxis]) * 1.1
    ])
    .range([0, chartWidth]);
console.log(xLinearScale);
  return xLinearScale;
  
}

///////////////////////////////////
///function to update y-axis scale
///////////////////////////////////
function yScale(data, yaxis){
  var yLinearScale = d3.scaleLinear()
    .domain([d3.min(data, d => d[yaxis]) * 0.7,
      d3.max(data, d => d[yaxis]) * 1.1
    ])
    .range([chartHeight,0]);

  return yLinearScale;
}

//////////////////////////////////////////////////////////////
// function to update xaxis var upon clicking on the axis label
////////////////////////////////////////////////////////////////
function updateX(newXScale, xAxis) {
  var bottomAxis = d3.axisBottom(newXScale);

  xAxis.transition()
    .duration(1000)
    .call(bottomAxis);

  return xAxis;
}

//////////////////////////////////////////////////////////////
// function to update yaxis var upon clicking on the axis label
////////////////////////////////////////////////////////////////
function updateY(newYScale, yAxis) {
  var leftAxis = d3.axisLeft(newYScale);

  yAxis.transition()
    .duration(1000)
    .call(leftAxis);

  return yAxis;
}

//////////////////////////////////////////////////////////////
/////function to render circles when x axis changes////////////////
////////////////////////////////////////////////////////////
function renderCirclesX(circlesGroup, newXScale, xaxis) {

  circlesGroup.transition()
    .duration(1000)
    .attr("cx", d => newXScale(d[xaxis]));

  return circlesGroup;
}

//////////////////////////////////////////////////////////////
/////function to render circles when y axis changes////////////////
////////////////////////////////////////////////////////////
function renderCirclesY(circlesGroup, newYScale, yaxis) {

  circlesGroup.transition()
    .duration(1000)
    .attr("cy", d => newYScale(d[yaxis]));

  return circlesGroup;
}

////////////////////////////////////////////////////////////
////////function to attach text on the circles/////
////////////////////////////////////////////////////
function textToCircles(text, xaxis,yaxis,x,y) {
 
  text.transition()
    .duration(1000)
    .attr("x", function(d) { return x(d[xaxis])-5; })
    .attr("y", function(d) { return y(d[yaxis])+2.5; })
  return text;

}

////////////////////////////////////////////////////////////////
// function to update circles group with new tooltip
function updateToolTip(xaxis,yaxis, circlesGroup) {

  var xlabel;
  var ylabel;

  var toolTip = d3.tip()
    .attr("class", "tooltip")
    .offset([80, -60])
    .html(function(d) {
      if (xaxis === "poverty") {
        xlabel = "Poverty:";
        if (yaxis === "healthcare"){
          ylabel = "healthcare"
          return (`${d.abbr}<br>${xlabel} ${d[xaxis]}%<br>${ylabel} ${d[yaxis]}%`);
        }
        if (yaxis === "obesity"){
          ylabel = "Obesity"
          return (`${d.abbr}<br>${xlabel} ${d[xaxis]}%<br>${ylabel} ${d[yaxis]}%`);
        }
        if (yaxis === "smokes"){
          ylabel = "Smokers"
          return (`${d.abbr}<br>${xlabel} ${d[xaxis]}%<br>${ylabel} ${d[yaxis]}%`);
        }
      }
      if (xaxis === "income") {
        xlabel = "Income:";
          if (yaxis === "healthcare"){
            ylabel = "healthcare"
            return (`${d.abbr}<br>${xlabel} ${d[xaxis]}<br>${ylabel} ${d[yaxis]}%`);
          }
          if (yaxis === "obesity"){
            ylabel = "Obesity"
            return (`${d.abbr}<br>${xlabel} ${d[xaxis]}<br>${ylabel} ${d[yaxis]}%`);
          }
          if (yaxis === "smokes"){
            ylabel = "Smokers"
            return (`${d.abbr}<br>${xlabel} ${d[xaxis]}<br>${ylabel} ${d[yaxis]}%`);
          }
      }
      
      if (xaxis === "age") {
        xlabel = "Age:";
          if (yaxis === "healthcare"){
            ylabel = "healthcare"
            return (`${d.abbr}<br>${xlabel} ${d[xaxis]}%<br>${ylabel} ${d[yaxis]}%`);
          }
          if (yaxis === "obesity"){
            ylabel = "Obesity"
            return (`${d.abbr}<br>${xlabel} ${d[xaxis]}%<br>${ylabel} ${d[yaxis]}%`);
          }
          if (yaxis === "smokes"){
            ylabel = "Smokers"
            return (`${d.abbr}<br>${xlabel} ${d[xaxis]}%<br>${ylabel} ${d[yaxis]}%`);
          }
      }
    });

  circlesGroup.call(toolTip);

  circlesGroup.on("mouseover", function(data) {
    toolTip.show(data);
  })
    // onmouseout event
    .on("mouseout", function(data, index) {
      toolTip.hide(data);
    });

  return circlesGroup;
}
//////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////END of function definitions/////////////////
////////////////////////////////////////////////////////////////////////////////////////

//Read the data file - need to run the local server
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


//scales for the axes
var x = xScale(healthData,xaxis);
var y = yScale(healthData,yaxis);
 
var bottomAxis = d3.axisBottom(x);
var leftAxis = d3.axisLeft(y);

 // append x axis
 var xAxis = chartGroup.append("g")
 //.classed("x-axis", true)
 .attr("transform", `translate(0, ${chartHeight})`)
 .call(bottomAxis);

// append y axis
var yAxis = chartGroup.append("g")
 .call(leftAxis);

//create a group for the circles
var circlesGroup = chartGroup.selectAll("circle")
    .data(healthData)
    .enter()
    .append("circle")
    .attr("cx", d => x(d.poverty))
    .attr("cy", d => y(d.healthcare))  
    .attr("r", "15")
    .attr("fill", "blue")
    .attr("opacity", ".5");


//create a group for text 
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



//////////////////////////////////////
// Create group for three x-axis labels and add the three labels
///only the 'poverty' is active by default
//////////////////////////////////
var xlabelsGroup = chartGroup.append("g")
  .attr("transform", `translate(${chartWidth/2}, ${chartHeight + 20})`);

var povertyLabel = xlabelsGroup.append("text")
  .attr("x", 0)
  .attr("y", 20)
  .attr("value", "poverty") // value to grab for event listener
  .classed("active", true)
  .text("In Poverty (%)");

var ageLabel = xlabelsGroup.append("text")
  .attr("x", 0)
  .attr("y", 40)
  .attr("value", "age") // value to grab for event listener
  .classed("inactive", true)
  .text("Age (Median)");

var incomeLabel = xlabelsGroup.append("text")
  .attr("x", 0)
  .attr("y", 60)
  .attr("value", "income") // value to grab for event listener
  .classed("inactive", true)
  .text("Annual Household Income in $(Median)");

//////////////////////////////////////
// Create group for three y-axis labels and add the three labels
///only the 'healthcare' is active by default
//////////////////////////////////
var ylabelsGroup = chartGroup.append("g")
  .attr("transform", `translate(${-chartHeight/1.5}, ${margin.left})`);

var healthcareLabel = ylabelsGroup.append("text")
.attr("transform", "rotate(-90)")
  .attr("x", 0)
  .attr("y", 135)
  .attr("value", "healthcare") // value to grab for event listener
  .classed("active", true)
  .text("Lacks Healthcare (%)");

var smokeLabel = ylabelsGroup.append("text")
  .attr("transform", "rotate(-90)")
  .attr("x", 0)
  .attr("y", 115)
  .attr("value", "smokes") // value to grab for event listener
  .classed("inactive", true)
  .text("Smokes (%)");
    
var obeseLabel = ylabelsGroup.append("text")
  .attr("transform", "rotate(-90)")
  .attr("x", 0)
  .attr("y", 95)
  .attr("value", "obesity") // value to grab for event listener
  .classed("inactive", true)
  .text("Obese (%)");
  
  ///Adding tool-tips
  var circlesGroup = updateToolTip(xaxis,yaxis, circlesGroup);

  //setting up listners to the labels
  xlabelsGroup.selectAll("text")
  
 // ylabelsGroup.selectAll("text")
  .on("click", function() {
  // get value of selection
    var value = d3.select(this).attr("value");
    if ((value === "age") || (value==="income") || (value==="poverty")) {
      console.log(value);
      xaxis = value;
      x = xScale(healthData,xaxis);
      //console.log(x);
      xAxis = updateX(x,xAxis);
      circlesGroup = renderCirclesX(circlesGroup, x, xaxis);
      text = textToCircles(text,xaxis,yaxis,x,y);
      circlesGroup = updateToolTip(xaxis,yaxis, circlesGroup);

      if (xaxis === "age") {
        ageLabel
          .classed("active", true)
          .classed("inactive", false);
        povertyLabel
          .classed("active", false)
          .classed("inactive", true);
        incomeLabel
          .classed("active", false)
          .classed("inactive", true);
      }

      if (xaxis === "income") {
        ageLabel
          .classed("active", false)
          .classed("inactive", true);
        povertyLabel
          .classed("active", false)
          .classed("inactive", true);
        incomeLabel
          .classed("active", true)
          .classed("inactive", false);
      }
      if (xaxis === "poverty") {
        ageLabel
          .classed("active", false)
          .classed("inactive", true);
        povertyLabel
          .classed("active", true)
          .classed("inactive", false);
        incomeLabel
          .classed("active", false)
          .classed("inactive", true);
      }

    }

  })

  //setting up a listner to y-lables
  ylabelsGroup.selectAll("text")
  .on("click", function() {
    var value = d3.select(this).attr("value");
    if ((value === "smokes") || (value==="obesity") || (value==="healthcare")) {
      console.log(value);
      yaxis = value;
      y = yScale(healthData,yaxis);
      yAxis = updateY(y,yAxis);

      //update circles
      circlesGroup = renderCirclesY(circlesGroup, y, yaxis);

      //updtae text on the circles
      text = textToCircles(text,xaxis,yaxis,x,y);
     
      //update tool tips
      circlesGroup = updateToolTip(xaxis,yaxis, circlesGroup);


      if (yaxis === "smokes") {
        smokeLabel
          .classed("active", true)
          .classed("inactive", false);
        obeseLabel
          .classed("active", false)
          .classed("inactive", true);
        healthcareLabel
          .classed("active", false)
          .classed("inactive", true);
      }

      if (yaxis === "obesity") {
        smokeLabel
          .classed("active", false)
          .classed("inactive", true);
        obeseLabel
          .classed("active", true)
          .classed("inactive", false);
        healthcareLabel
          .classed("active", false)
          .classed("inactive", true);
      }

      if (yaxis==="healthcare" ) {
        
        smokeLabel
          .classed("active", false)
          .classed("inactive", true);
        obeseLabel
          .classed("active", false)
          .classed("inactive", true);
        healthcareLabel
          .classed("active", true)
          .classed("inactive", false);
      }

    }

  })

}).catch(function(error) {
  console.log(error);
});





