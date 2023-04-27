{
  // Months dropdown ///////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////////
  // Create months to fill dropdown
  const monthLabels = [
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
  const monthLabelToValue = {
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
    .data(monthLabels)
    .enter()
    .append('option')
    .text(d => d)
    .attr('value', d => d);

  // Set the first dropdown option as the default (if there are options)
  if (monthDropdown.select('option').size() > 0) {
    monthDropdown.property('selectedIndex', 0);
  }

  // Climate indicators dropdown ///////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////////
  // Create climate indicators to fill dropdown
  const climateIndicatorLabels = [
    'Sea Ice',
    'Snow Cover'
  ]

  // Create a dictionary to easily convert from label to value format
  const climateIndicatorLabelToValue = {
    'Sea Ice'   : 'seaIce',
    'Snow Cover': 'snowCover'
  }

  // Select the dropdown element and populate it with climate indicators
  const climateIndicatorDropdown = d3.select('#climateIndicator-select');
  climateIndicatorDropdown.selectAll('option')
    .data(climateIndicatorLabels)
    .enter()
    .append('option')
    .text(d => d)
    .attr('value', d => d);

  // Set the first dropdown option as the default (if there are options)
  if (climateIndicatorDropdown.select('option').size() > 0) {
    climateIndicatorDropdown.property('selectedIndex', 0);
  }

  // Region dropdown ///////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////////
  // Create climate indicators to fill dropdown when sea ice is selected
  const seaIceRegionLabels = [
    'Global',
    'Northern Hemisphere',
    'Southern Hemisphere'
  ]

  // Create climate indicators to fill dropdown when snoew cover is selected
  const snowCoverRegionLabels = [
    'Eurasia',
    'North America',
    'North America and Greenland',
    'Northern Hemisphere'
  ]

  // Create a dictionary to easily convert from label to value format
  const regionLabelToValue = {
    'Global'   : 'global',
    'Northern Hemisphere': 'northernHemisphere',
    'Southern Hemisphere': 'southernHemisphere',
    'Eurasia': 'eurasia',
    'North America' : 'northAmerica',
    'North America and Greenland' : 'northAmericaGreenland',
    'Northern Hemisphere' : 'northernHemisphere'
  }

  // The regions are different between climate indicators. This function
  // updates the options displayed in the region dropdown so they are what
  // is available for a specific region. It also sets the first element of
  // the dropdown as its value.
  function updateRegionDropdown() {
    // Get the value of the climate indicator dropdown
    const selectedClimateIndicator = d3.select('#climateIndicator-select').property('value');
    // Figure out which labels to use from that value
    let regionLabels = seaIceRegionLabels; // use seaIceLabels by default
    if(selectedClimateIndicator == 'Sea Ice') {
      regionLabels = seaIceRegionLabels;
    } else if (selectedClimateIndicator == 'Snow Cover') {
      regionLabels = snowCoverRegionLabels;
    }

    // Select the region dropdown
    const regionDropdown = d3.select('#region-select');

    // Remove existing labels
    regionDropdown.selectAll('option').remove();
    
    // Add new labels
    regionDropdown.selectAll('option')
    .data(regionLabels)
    .enter()
    .append('option')
    .text(d => d)
    .attr('value', d => d);

    // Set the first dropdown option as the default (if there are options)
    if (regionDropdown.select('option').size() > 0) {
      regionDropdown.property('selectedIndex', 0);
    }
  }

  // Select the dropdown for easy access later in script
  const regionDropdown = d3.select('#region-select');

  // Call the function to initialize the dropdown
  updateRegionDropdown();

  // Chart /////////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////////
  // Define the path to the JSON file
  const pathToJsonData = '../data/all_data.json';

  // Use D3 to load the JSON file
  d3.json(pathToJsonData)
  .then(contents => {
    // Print the initial contents of the JSON file to the console
    // console.log(contents);

    // Create the svg chart container element
    // This will hold the bars and axes for the barchart
    const margin = {top: 20, right: 20, bottom: 30, left: 50},
    width = 1200 - margin.left - margin.right,
    height = 775 - margin.top - margin.bottom;

    const x = d3.scaleBand()
      .range([0, width])
      .padding(0.25);

    const y = d3.scaleLinear()
      .range([height, 0]);

    const svg = d3.select("#bar-chart").append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // Append a new element to hold the y-axis label
    const yAxisLabelElement = svg.append('g')
      .attr('class', 'y-axis-label');

    // Append text to y-axis label
    const yAxisLabelText = yAxisLabelElement.append('text')
      .attr('transform', 'rotate(-90)')
      .attr('y', margin.left - 90)
      .attr('x', -height / 2)
      .attr('dy', '1em')
      .text('Million Kilometers Squared');

    // Append a new element to hold the title
    const chartTitleElement = svg.append('g')
      .attr('class', 'chart-title');

    // Append text to chart title
    const chartTitleText = chartTitleElement.append('text')
      .attr('x', width / 2)
      .attr('y', margin.top / 2)
      .attr('text-anchor', 'middle')
      .text(``); // default title text is nothing

    // Define the function to update the chart title
    // The title should include the region and climate indicator
    function updateChartTitle(selectedRegion, selectedClimateIndicator) {
      const newTitleText = `${selectedRegion} ${selectedClimateIndicator}`
      chartTitleText.text(newTitleText);
    }

    // Define the function to update the chart
    function updateChart(selectedMonth, selectedClimateIndicator, selectedRegion) {
      updateChartTitle(selectedRegion, selectedClimateIndicator);
      monthValue = monthLabelToValue[selectedMonth];
      climateIndicatorValue = climateIndicatorLabelToValue[selectedClimateIndicator];
      regionValue = regionLabelToValue[selectedRegion];
      // Get new relevant data to plot based on new filter
      const filteredData = Object.values(contents).filter(d => {
        return (d.month === monthValue 
                && d.climateIndicator === climateIndicatorValue 
                && d.region === regionValue)
        }
      );
      // log the filtered data
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
    updateChart(monthDropdown.property('value'), 
                climateIndicatorDropdown.property('value'), 
                regionDropdown.property('value'));

    // Add an event listener to the month selector dropdown
    // This makes it so when the dropdown values change the graph is updated
    monthDropdown.on('change', function() {
      const selectedMonth = d3.select(this).property('value');
      const selectedClimateIndicator = d3.select('#climateIndicator-select').property('value');
      const selectedRegion = d3.select('#region-select').property('value');
      updateChart(selectedMonth, selectedClimateIndicator, selectedRegion);
    });

    // Add an event listener to the climate indicator selector dropdown
    // This makes it so when the dropdown values change the graph is updated
    // It also updates the values in the region dropdown
    climateIndicatorDropdown.on('change', function() {
      const selectedMonth = d3.select('#month-select').property('value');
      const selectedClimateIndicator = d3.select(this).property('value');
      updateRegionDropdown();
      const selectedRegion = d3.select('#region-select').property('value');
      updateChart(selectedMonth, selectedClimateIndicator, selectedRegion);
    });

    // Add an event listener to the region dropdown
    // this makes it so when the dropdown values change the graph is updated
    regionDropdown.on('change', function() {
      const selectedMonth = d3.select('#month-select').property('value');
      const selectedClimateIndicator = d3.select('#climateIndicator-select').property('value');
      const selectedRegion = d3.select(this).property('value');
      updateChart(selectedMonth, selectedClimateIndicator, selectedRegion);
    });
  })
  .catch(error => {
    // Handle any errors that occur during loading
    console.error(error);
  });
}
