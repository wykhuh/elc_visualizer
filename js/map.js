
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
  const margin = {top: 20, right: 20, bottom: 30, left: 50};

  // Define map projection
  var projection = d3
    .geoEquirectangular()
    .center([-0, 20]) // set centre to further North as we are cropping more off bottom of map
    .scale(150) // scale to fit group width
    .translate([w / 2, h / 2]); // ensure centred in group


  // Define map path
  var path = d3
    .geoPath()
    .projection(projection);

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
  })
