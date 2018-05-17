// var formEl = document.querySelector('.taxon-form');
// formEl.addEventListener('submit', (e) => {

//   debugger
// })

var ageEl = document.querySelector('.js-age');
var occurencesEl = document.querySelector('.js-occurences');
var linkEl = document.querySelector('.js-link');

var submitEl = document.querySelector('.taxon-submit');
submitEl.addEventListener('click', (e) => {
  e.preventDefault();
  let targetTaxon = document.querySelector('.taxon').value
  fetchTaxon(targetTaxon)
})

const fetchTaxon = (targetTaxon) => {
  url = 'http://earthlifeconsortium.org/api_v1/occ?taxon=' + targetTaxon;

  axios.get(url).then((res) => {

    let { records, metadata } = res.data
    if (records.length < 0) {
      return
    }

    records = _.sortBy(records, 'max_age')
    let filtered = _.filter(records, (g) => g.max_age && g.lat && g.lon)

    let el = document.querySelector('.js-total-occurences')
    el.innerHTML = filtered.length


    let grouped = _.chain(records)
    .filter((g) => g.max_age && g.lat && g.lon)
    .groupBy('max_age')
    .value()
    console.log('grouped', grouped)

    let ages =  Object.keys(grouped)
    console.log('ages', ages)

    maxAge = _.maxBy(records, 'max_age').max_age;
    minAge = _.minBy(records, 'min_age').min_age;

    // interval = (maxAge - minAge) / 3000;

    let interval = (maxAge - minAge) / ages.length
    console.log('interval', interval)

    let prevAge = 0;
    ages.forEach((age, i) => {
      let filterRecords = []
      // console.log(i, age)

      // filterRecords = _.filter(records, (r) => r.max_age < Number(minAge + i * interval));
      // console.log('filterRecords', filterRecords.length, i , i * interval)

      setTimeout(() => {
      //   console.log('prevAge', age, i,  Number(ages[i -1] || 0 ))
      //   filterRecords = _.filter(records, (r) => r.max_age < Number(age));
      //   console.log(filterRecords)

      //   addPoints(filterRecords);

      filterRecords = _.filter(records, (r) => { return r.max_age <= Number(age) });
        console.log('filterRecords', filterRecords.length,  Number(age))
        addPoints(filterRecords);

        ageEl.innerHTML = 'max age: ' + Number(age).toFixed(4) + ' MYA'
        occurencesEl.innerHTML = filterRecords.length + ' occurences'
      }, i * 500)
      // prevAge = age


    })

    drawGraph(records);
    drawTable(records);
    linkEl.href = url + '&output=csv'


  })

}
