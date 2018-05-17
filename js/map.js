

// DEFINE VARIABLES
// Define size of map group
// Full world map is 2:1 ratio
// Using 12:5 because we will crop top and bottom of map
let w = 2000;
let h = 1000;
// variables for catching min and max zoom factors
var minZoom;
var maxZoom;

var mapHolderEl = document.querySelector('#map-holder');
var mapHolderWidth = mapHolderEl.offsetWidth;
var mapHolderHeight = mapHolderEl.offsetHeight;


// Define map projection
var projection = d3
  .geoEquirectangular()
  .center([0, 15]) // set centre to further North as we are cropping more off bottom of map
  .scale([w / (2 * Math.PI)]) // scale to fit group width
  .translate([w / 2, h / 2]) // ensure centred in group
;

// Define map path
var path = d3
  .geoPath()
  .projection(projection);

// Create function to apply zoom to countriesGroup
function zoomed() {
  t = d3
    .event
    .transform;
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
    .translateExtent([[0, 0], [w, h]])
  ;
  // define X and Y offset for centre of map to be shown in centre of holder
  midX = (mapHolderWidth - minZoom * w) / 2;
  midY = (mapHolderHeight - minZoom * h) / 2;
  // change zoom transform to min zoom and centre offsets
  svg.call(zoom.transform, d3.zoomIdentity.translate(midX, midY).scale(minZoom));
}

// create an SVG
var svg = d3
  .select("svg")
  .attr("width", mapHolderWidth)
  .attr("height", mapHolderHeight)
 ;


// get map data
d3.json("./data/world.geo.json")
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

  initiateZoom();
})
