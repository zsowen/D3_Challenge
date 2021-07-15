var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 60,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;


//Create SVG wrapper, append a SVG group to hold the chart and shift the new chartgroup by the left and top margins
var svg = d3.select("#scatter")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight);

var chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

//Import Data    
d3.csv("assets/data/data.csv").then(function(censusData) {

    //Parse the data & cast as numbers
    censusData.forEach(function(data) {
        data.poverty = +data.poverty;
        data.obesity = +data.obesity;
    });

    //Create Scale Functions
    var xLinearScale = d3.scaleLinear()
        .domain([8, d3.max(censusData, d => d.poverty) + 3])
        .range([0,width]);

    var yLinearScale = d3.scaleLinear()
        .domain([10, d3.max(censusData, d => d.obesity) + 5])
        .range([height, 0]);

    //Create Axis Functions
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    //Append Axes to the chart
    chartGroup.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(bottomAxis);

    chartGroup.append("g")
        .call(leftAxis);

    //Create Circles
    var circlesGroup = chartGroup.append("g")
    .attr("class", "circlesGroup")
    .selectAll("circle")
    .data(censusData)
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale(d.poverty))
    .attr("cy", d => yLinearScale(d.obesity))
    .attr("r", "15")
    .attr("fill", "blue")
    .attr("opacity", "0.5");

    //Overlay State Abbreviations over the circles
    var textGroup = chartGroup.append("g")
    .selectAll("text")
    .data(censusData)
    .enter()
    .append("text")
    .attr("x", d => xLinearScale(d.poverty))
    .attr("y", d => yLinearScale(d.obesity))
    .attr("text-anchor", "middle")
    .attr("font-size", "16px")
    .attr("fill", "black")
    .text(d => d.abbr);

    //Initialize tooltip
    var toolTip = d3.tip()
        .attr("class", "tooltip")
        .offset([80, -60])
        .html(function(d) {
            return( `${d.state}<br>Poverty Rate: ${d.poverty}<br>Obesity Rate: ${d.obesity}`);
        });
    
    //Create Tooltip in chart
    chartGroup.call(toolTip);

    //Create event listener to display tooltip on click
    circlesGroup.on("click", function(data) {
        toolTip.show(data, this);
    })

        //Create event listener to hide tooltip on mouseout
        .on("mouseout", function(data, index) {
            toolTip.hide(data);
        });

    //Create Axes Labels
    chartGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left + 40)
        .attr("x", 0 - (height / 2))
        .attr("dy", "1em")
        .attr("class", "axisText")
        .text("Obesity Rate by State");

    chartGroup.append("text")
        .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
        .attr("class", "axisText")
        .text("Poverty Rate by State");
    }).catch(function(error) {
        console.log(error);
});