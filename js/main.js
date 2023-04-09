// Define the path to the JSON file
const pathToJsonData = '../rawData/seaIce_global_allMonths.json';

// Use D3 to load the JSON file
d3.json(pathToJsonData)
.then(contents => {
  // Print the initial contents of the JSON file to the console
  console.log(contents);
  
  // Make it easier to access the relevant data from the file
  const data = contents.data;

  // Loop over each item in the object
  for (var key in data) {
    // Extract the year and month from the key
    var year = key.substring(0, 4);
    var month = key.substring(4, 6);

    // Add the year, month, and date properties to the item
    data[key].year = year;
    data[key].month = month;
    data[key].date = month + ' ' + year;

    // Cleans invalid entries
    // on seaIce_global_allMonths.json -9999 marks all invalid numerical values
    if(data[key].value == -9999 || 
      data[key].monthlyMean == -9999 ||
      data[key].anom == -9999
      ) {
      data[key].value = 0;
      data[key].monthlyMean = 0;
      data[key].anom = 0;
    }

    if(data[key].value < 0) {
      data[key].value = 0;
    }

    if(data[key].value < 0) {
      data[key].value = 0;
    }
  }

  // Print the modified contents of the JSON file to the console
  console.log(data);

  // Create months to fill dropdown
  const months = [
    'January', 
    'February', 
    'March', 
    'April', 
    'May', 
    'June', 
    'July', 
    'August', 
    'September', 
    'October', 
    'November', 
    'December'
  ];

  // Create a dictionary to easily convert from name to number format
  const monthNameToNum = {
    'January'   : '01',
    'February'  : '02',
    'March'     : '03',
    'April'     : '04',
    'May'       : '05', 
    'June'      : '06',
    'July'      : '07',
    'August'    : '08',
    'September' : '09',
    'October'   : '10',
    'November'  : '11',
    'December'  : '12'
  }

  // Select the dropdown element and populate it with months
  const monthDropdown = d3.select('#month-select');
  monthDropdown.selectAll('option')
    .data(months)
    .enter()
    .append('option')
    .text(d => d)
    .attr('value', d => d);

  // Set the first dropdown option as the default (if there are options)
  if (monthDropdown.select('option').size() > 0) {
    monthDropdown.property('selectedIndex', 0);
  }

  // Create the svg chart container element
  // This will hold the bars and axes for the barchart
  const margin = {top: 20, right: 20, bottom: 30, left: 50},
  width = 960 - margin.left - margin.right,
  height = 500 - margin.top - margin.bottom;

  const x = d3.scaleBand()
    .range([0, width])
    .padding(0.1);

  const y = d3.scaleLinear()
    .range([height, 0]);

  const svg = d3.select("#bar-chart").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  // Define the function to update the chart
  function updateChart(selectedMonth) {
    console.log(monthNameToNum[selectedMonth]);
    // Get new relevant data to plot based on new filter
    const filteredData = Object.values(data).filter(d => d.month === monthNameToNum[selectedMonth]);

    // change the x and y domains to fit the new data
    x.domain(filteredData.map(d => d.year));
    y.domain([0, d3.max(filteredData, d => d.value)]);

    // replace all bars with the ones for the new data
    svg.selectAll('.bar').remove();
    svg.selectAll('.bar')
      .data(filteredData)
      .enter().append('rect')
      .attr('class', 'bar')
      .attr('x', d => x(d.year))
      .attr('width', x.bandwidth())
      .attr('y', d => y(d.value))
      .attr('height', d => height - y(d.value));

    // replace all axis with the ones for the new data
    svg.selectAll('.axis').remove();
    svg.append('g')
      .attr('class', 'axis axis-x')
      .attr('transform', 'translate(0,' + height + ')')
      .call(d3.axisBottom(x));
    svg.append('g')
      .attr('class', 'axis axis-y')
      .call(d3.axisLeft(y));
  }

  // Initialize the chart with the default month
  updateChart(monthDropdown.property('value'));

  // Add an event listener to the month selector dropdown
  // this makes it so when the dropdown values change the graph is updated
  monthDropdown.on('change', function() {
    const selectedMonth = d3.select(this).property('value');
    updateChart(selectedMonth);
  });
})
.catch(error => {
  // Handle any errors that occur during loading
  console.error(error);
});
