const drawTable = (data) => {
  const table = d3.select('#table');

  let tableRows = table.selectAll('tr').remove();
  let cols = ['occ_id', 'lat', 'lon', 'max_age', 'min_age']

  table.append('tr')

  const thead = table.append('thead');
  const tbody = table.append('tbody');

  // append the header row
  thead.append("tr")
    .attr('class', 'label-row')
    .selectAll("th")
    .data(cols)
    .enter()
    .append("th")
    .text((column) => column);

  // create a row for each object in the data
  const rows = tbody.selectAll("tr")
    .data(data)
    .enter()
    .append("tr")

  // create a cell in each row for each column
  rows.selectAll("td")
    .data((row) => {
      return cols.map((column) => row[column]);
    })
    .enter()
    .append("td")
    .text((d) => d);
}
