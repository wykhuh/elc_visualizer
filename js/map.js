let w = 900;
let h = 500;
let minZoom;
let maxZoom;
let maxAge;
let minAge;
let interval;
let currentAge;
let countriesGroup;
var mapHolderEl = document.querySelector('#map-holder');
var mapHolderWidth = mapHolderEl.offsetWidth;
var mapHolderHeight = mapHolderEl.offsetHeight;
let t;

// Define map projection
var projection = d3
  .geoEquirectangular()
  .center([-90, 35]) // set centre to further North as we are cropping more off bottom of map
  .scale(350) // scale to fit group width
  .translate([w / 2, h / 2]); // ensure centred in group


// Define map path
var path = d3
  .geoPath()
  .projection(projection);


// Create function to apply zoom to countriesGroup
function zoomed() {
   t = d3.event.transform;

  countriesGroup
    .attr("transform","translate(" + [t.x, t.y] + ")scale(" + t.k + ")");
}

// Define map zoom behaviour
var zoom = d3
  .zoom()
  .on("zoom", zoomed);

// Function that calculates zoom/pan limits and sets zoom to default value
function initiateZoom() {
  // Define a "minzoom" whereby the "Countries" is as small possible without leaving white space at top/bottom or sides
  minZoom = Math.max(mapHolderWidth / w, mapHolderHeight / h);

  // set max zoom to a suitable factor of this value
  maxZoom = 20 * minZoom;

  // set extent of zoom to chosen values
  // set translate extent so that panning can't cause map to move out of viewport
  zoom
    .scaleExtent([minZoom, maxZoom])
    .translateExtent([[0, 0], [w, h]]);

  // define X and Y offset for centre of map to be shown in centre of holder
  midX = (mapHolderWidth - minZoom * w) / 2;
  midY = (mapHolderHeight - minZoom * h) / 2;

  // change zoom transform to min zoom and centre offsets
  svg.call(zoom.transform, d3.zoomIdentity.translate(midX, midY).scale(minZoom));
}

function addPoints(data) {
  const cleanData = data.filter((d) => d.lat && d.lon)

  svg.selectAll("circle")
  .data(cleanData).enter()
  .append("circle")
  .attr("cx", function (d) {
     return projection([d.lon, d.lat])[0];
  })
  .attr("cy", function (d) {
    return projection([d.lon, d.lat])[1];
  })
  .attr("r", "3px")
  .attr("fill", "red")

}

// create an SVG
var svg = d3
  .select("svg")
  .attr("width", mapHolderWidth)
  .attr("height", mapHolderHeight);


// get map data
d3.json("./data/continent_North_America_subunits.json")
.then((json) => {
  countriesGroup = svg.append("g").attr("id", "map");
  // add a background rectangle
  countriesGroup
    .append("rect")
    .attr("x", 0)
    .attr("y", 0)
    .attr("width", w)
    .attr("height", h);

  // draw a path for each feature/country
  countries = countriesGroup
    .selectAll("path")
    .data(json.features)
    .enter()
    .append("path")
    .attr("d", path)
    .attr("id", function(d, i) {
      return "country" + d.properties.iso_a3;
    })
    .attr("class", "country");

  // initiateZoom();
}).then(() => {
  const url = 'http://earthlifeconsortium.org/api_v1/occ?taxon=Mammut%20americanum';

  return axios.get(url)
}).then((res) => {
    const { records, metadata } = res.data
    maxAge = _.maxBy(records, 'max_age').max_age;
    minAge = _.minBy(records, 'min_age').min_age;
    interval = (maxAge - minAge) / 3000;
    currentAge = minAge;

    addPoints(records);

})
