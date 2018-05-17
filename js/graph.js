const drawGraph = (rawData) => {

var mapHolderEl = document.querySelector('#map-holder');
var mapHolderWidth = mapHolderEl.offsetWidth;
var mapHolderHeight = mapHolderEl.offsetHeight;

var graphHolderEl = document.querySelector('#graph-holder');
var graphHolderWidth = graphHolderEl.offsetWidth;
var graphHolderHeight = graphHolderEl.offsetHeight;
// debugger
  var svg = d3.select(".graph")
  .attr("width", graphHolderWidth)
  .attr("height", graphHolderHeight);
  const margin = {top: 20, right: 20, bottom: 30, left: 50};

  var width = graphHolderWidth - margin.left - margin.right;
  var height = graphHolderHeight - margin.top - margin.bottom;

  var g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  let data  = _.chain(rawData)
    .sortBy('max_age')
    .groupBy('max_age')
    .map((g) => {
      return { max_age: g[0]['max_age'], count: g.length }
    })
    .filter((g) => g.max_age)
    .value();

console.log

  var y = d3.scaleLinear()
  .domain(d3.extent(data, function(d) { return d.count; }))
    .rangeRound([height, 0]);

  var x = d3.scaleLinear()
    .domain(d3.extent(data, function(d) { return d.max_age; }))
    .range([width, 0]);

    // var ordinalScale = d3.scaleOrdinal()
    // .domain(data.map( d => d.max_age) )
    // .range([0, 1, 2, 3, x(4), x(6)]);

  var line = d3.line()
    .x(function(d) { return x(d.max_age); })
    .y(function(d) { return y(d.count); });


  // .attr("width", width)
  // .attr("height", height)
  // .attr("transform", "translate(0," + 10 + ")")

  var xAxis = d3.axisBottom(x)
  .tickFormat(function(d) {return data[d].max_age })

d3.axisBottom(x)
  g.append("g")
    .attr("transform", "translate(0," + height + ")")
      .call(xAxis)
      .append("text")
      .attr("fill", "#000")
      .attr("y", 6)
      .attr("dy", "0.71em")
      .attr("text-anchor", "end")
      .text("MYA")

  g.append("path")
  .datum(data)
  .attr("fill", "none")
  .attr("stroke", "steelblue")
  .attr("stroke-linejoin", "round")
  .attr("stroke-linecap", "round")
  .attr("stroke-width", 1.5)
  .attr("d", line);
}
