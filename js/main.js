// Define the path to the JSON file
const pathToJsonData = '../data/all_data.json';

// Use D3 to load the JSON file
d3.json(pathToJsonData)
.then(contents => {
  // Print the initial contents of the JSON file to the console
  // console.log(contents);
  
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

  // Create climate indicators to fill dropdown
  const climateIndicators = [
    'Sea Ice',
    'Snow Cover'
  ]

  // Create a dictionary to easily convert from label to value format
  const climateIndicatorLabelToValue = {
    'Sea Ice'   : 'seaIce',
    'Snow Cover': 'snowCover'
  }

  // Select the dropdown element and populate it with months
  const climateIndicatorDropdown = d3.select('#climateIndicator-select');
  climateIndicatorDropdown.selectAll('option')
    .data(climateIndicators)
    .enter()
    .append('option')
    .text(d => d)
    .attr('value', d => d);

  // Set the first dropdown option as the default (if there are options)
  if (climateIndicatorDropdown.select('option').size() > 0) {
    climateIndicatorDropdown.property('selectedIndex', 0);
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
  function updateChart(selectedMonth, selectedClimateIndicator) {
    // Get new relevant data to plot based on new filter
    const filteredData = Object.values(contents).filter(d => {
      monthNum = monthNameToNum[selectedMonth];
      climateIndicatorValue = climateIndicatorLabelToValue[selectedClimateIndicator];
      return d.month === monthNum && d.climateIndicator === climateIndicatorValue}
    );
    // console.log(filteredData);

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

  // Initialize the chart with the default month and indicator
  updateChart(monthDropdown.property('value'), climateIndicatorDropdown.property('value'));

  // Add an event listener to the month selector dropdown
  // this makes it so when the dropdown values change the graph is updated
  monthDropdown.on('change', function() {
    const selectedMonth = d3.select(this).property('value');
    const selectedClimateIndicator = d3.select('#climateIndicator-select').property('value');
    updateChart(selectedMonth, selectedClimateIndicator);
  });

  // Add an event listener to the climate indicator selector dropdown
  // this makes it so when the dropdown values change the graph is updated
  climateIndicatorDropdown.on('change', function() {
    const selectedMonth = d3.select('#month-select').property('value');
    const selectedClimateIndicator = d3.select(this).property('value');
    updateChart(selectedMonth, selectedClimateIndicator);
  });
})
.catch(error => {
  // Handle any errors that occur during loading
  console.error(error);
});