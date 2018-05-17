(function() {
  const mapHolderEl = document.querySelector('#map-holder');

  const width = 3000;
  const height = 1250;
  let minZoom;
  let maxZoom;

  // Define map projection
  const projection = d3
    .geoEquirectangular()
    .center([0, 15]) // set centre to further North
    .scale([width / (2 * Math.PI)]) // scale to fit group width
    .translate([width / 2, height / 2]); // ensure centred in group

  // Define map path
  const path = d3
    .geoPath()
    .projection(projection);


  // apply zoom to countriesGroup
  function zoomed() {
    transform = d3.event.transform;
    countriesGroup.attr(
      "transform",
      `translate(${transform.x}, ${transform.y})scale(${transform.k})`
    );
  }

  // Define map zoom behaviour
  const zoom = d3
    .zoom()
    .on("zoom", zoomed)

  function getTextBox(selection) {
    selection.each(function(d) {
      d.bbox = this.getBBox();
    });
  }

  var svg = d3
    .select("#map-holder")
    .append("svg")
    // set to the same size as the "map-holder" div
    .attr("width", mapHolderEl.offsetWidth)
    .attr("height", mapHolderEl.offsetHeight)
    // add zoom functionality
    .call(zoom);

    debugger
  // get map data
  d3.json("./data/world.geo.json",
    (json) => {
     debugger
    }
  );

})()
