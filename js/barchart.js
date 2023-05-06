{
  // Months dropdown ///////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////////
  // Create months to fill dropdown.
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

  // Create a dictionary to easily convert from name to number format.
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

  // Select the dropdown element and populate it with months.
  const monthDropdown = d3.select('#barchart-month-select');
  monthDropdown.selectAll('option')
    .data(monthLabels)
    .enter()
    .append('option')
    .text(d => d)
    .attr('value', d => d);

  // Set the first dropdown option as the default (if there are options).
  if (monthDropdown.select('option').size() > 0) {
    monthDropdown.property('selectedIndex', 0);
  }

  // Climate indicators dropdown ///////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////////
  // Create climate indicators to fill dropdown.
  const climateIndicatorLabels = [
    'Sea Ice',
    'Snow Cover'
  ]

  // Create a dictionary to easily convert from label to value format.
  const climateIndicatorLabelToValue = {
    'Sea Ice'   : 'seaIce',
    'Snow Cover': 'snowCover'
  }

  // Select the dropdown element and populate it with climate indicators.
  const climateIndicatorDropdown = d3.select('#barchart-climateIndicator-select');
  climateIndicatorDropdown.selectAll('option')
    .data(climateIndicatorLabels)
    .enter()
    .append('option')
    .text(d => d)
    .attr('value', d => d);

  // Set the first dropdown option as the default (if there are options).
  if (climateIndicatorDropdown.select('option').size() > 0) {
    climateIndicatorDropdown.property('selectedIndex', 0);
  }

  // Region dropdown ///////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////////
  // Create climate indicators to fill dropdown when sea ice is selected.
  const seaIceRegionLabels = [
    'Global',
    'Northern Hemisphere',
    'Southern Hemisphere'
  ]

  // Create climate indicators to fill dropdown when snoew cover is selected.
  const snowCoverRegionLabels = [
    'Eurasia',
    'North America',
    'North America and Greenland',
    'Northern Hemisphere'
  ]

  // Create a dictionary to easily convert from label to value format.
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
    // Get the value of the climate indicator dropdown.
    const selectedClimateIndicator = d3.select('#barchart-climateIndicator-select').property('value');
    // Figure out which labels to use from that value.
    let regionLabels = seaIceRegionLabels; // use seaIceLabels by default
    if(selectedClimateIndicator == 'Sea Ice') {
      regionLabels = seaIceRegionLabels;
    } else if (selectedClimateIndicator == 'Snow Cover') {
      regionLabels = snowCoverRegionLabels;
    }

    // Select the region dropdown.
    const regionDropdown = d3.select('#barchart-region-select');

    // Remove existing labels.
    regionDropdown.selectAll('option').remove();
    
    // Add new labels.
    regionDropdown.selectAll('option')
    .data(regionLabels)
    .enter()
    .append('option')
    .text(d => d)
    .attr('value', d => d);

    // Set the first dropdown option as the default (if there are options).
    if (regionDropdown.select('option').size() > 0) {
      regionDropdown.property('selectedIndex', 0);
    }
  }

  // Select the dropdown for easy access later in script.
  const regionDropdown = d3.select('#barchart-region-select');

  // Call the function to initialize the dropdown.
  updateRegionDropdown();

  // Chart /////////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////////
  // Define the path to the JSON file.
  const pathToJsonData = '../data/all_data.json';

  // Use D3 to load the JSON file.
  d3.json(pathToJsonData)
  .then(contents => {
    // Log the initial contents of the JSON file (useful for debugging).
    // console.log(contents);

    // Convert the years to dates so that scaleTime can be used for the axis.
    for(key in contents) {
      contents[key].date = new Date(`${contents[key].year}-${contents[key].month}-01`);
    }
    // Log modifed contents of JSON file (useful for debugging).
    // console.log(contents);

    // Create the svg chart container element.
    // This will hold the bars and axes for the barchart.
    const margin = {top: 30, right: 50, bottom: 30, left: 50},
    width = 900 - margin.left - margin.right,
    height = 480 - margin.top - margin.bottom;

    // Set the range on the axis. Domain depends on data and is set when the data
    // is loaded/changed. 
    const x = d3.scaleTime()
      .range([0, width]);

    const y = d3.scaleLinear()
      .range([height, 0]);

    const svg = d3.select('#barchart').append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

    // Append a new element to hold the y-axis label.
    const yAxisLabelElement = svg.append('g')
      .attr('class', 'y-axis-label');

    // Append text to y-axis label.
    // The way the superscript was handled was really hacky.
    const yAxisLabelText = yAxisLabelElement.append('text')
      .attr('transform', 'rotate(-90)')
      .attr('y', margin.left - 90)
      .attr('x', -height / 2)
      .attr('dy', '1em')
      .text('km') // text before superscript
      .append('tspan') // allow for a superscript
      .attr('baseline-shift', 'super')
      .text('2') // superscript text
      .append('tspan') // go back to regular text
      .attr('baseline-shift', 'sub')
      .text(' in Millions'); // text after superscript

    // Append a new element to hold the title.
    const chartTitleElement = svg.append('g')
      .attr('class', 'chart-title');

    // Append text to chart title.
    const chartTitleText = chartTitleElement.append('text')
      .attr('x', width / 2)
      .attr('y', 0)
      .attr('text-anchor', 'middle')
      .text(``); // default title text is nothing

    // Define the function to update the chart title.
    // The title should include the region and climate indicator.
    function updateChartTitle(selectedRegion, selectedClimateIndicator) {
      const newTitleText = `${selectedRegion} ${selectedClimateIndicator}`
      chartTitleText.text(newTitleText);
    }

    // Define the function to update the chart.
    function updateChart(selectedMonth, selectedClimateIndicator, selectedRegion) {
      updateChartTitle(selectedRegion, selectedClimateIndicator);
      monthValue = monthLabelToValue[selectedMonth];
      climateIndicatorValue = climateIndicatorLabelToValue[selectedClimateIndicator];
      regionValue = regionLabelToValue[selectedRegion];
      // Get new relevant data to plot based on new filter.
      const filteredData = Object.values(contents).filter(d => {
        return (d.month === monthValue 
                && d.climateIndicator === climateIndicatorValue 
                && d.region === regionValue)
        }
      );
      // Log the filtered data (useful for debugging).
      // console.log(filteredData);

      // Change the x and y domains to fit the new data.
      x.domain(d3.extent(filteredData.map(d => d.date)));
      y.domain([0, d3.max(filteredData, d => d.value)]);

      // Replace all bars with the ones for the new data.
      svg.selectAll('.bar').remove();
      svg.selectAll('.bar')
        .data(filteredData)
        .enter().append('rect')
        .attr('class', 'bar')
        .attr('x', d => x(d.date))
        .attr('width', width / filteredData.length)
        .attr('y', d => y(d.value))
        .attr('height', d => height - y(d.value))
        // Add the events to show the value on hover.
        .on('mouseover', function(event, d) {
          // Add the tooltip background rectangle. This makes the tooltip text easier to read
          d3.select(this.parentNode)
            .append('rect')
            .attr('class', 'bar-tooltip-bg')
            // These formulas center the rectangle and make it wide enough for the text
            .attr('x', x(d.date) - .5 * width / filteredData.length)
            .attr('width', 2 * width / filteredData.length)
            .attr('y', y(d.value) - 20)
            .attr('height', 20);

          // Add the tooltip text.
          d3.select(this.parentNode)
            .append('text')
            .attr('class', 'bar-tooltip-text')
            .attr('x', x(d.date) + (width / filteredData.length) / 2)
            .attr('y', y(d.value) - 5)
            .attr('text-anchor', 'middle')
            .text(d.value);
        })
        .on('mouseout', function() {
          d3.selectAll('.bar-tooltip-bg').remove();
          d3.selectAll('.bar-tooltip-text').remove();
        });

      // Replace all axis with the ones for the new data.
      svg.selectAll('.axis').remove();
      svg.append('g')
        .attr('class', 'axis axis-x')
        .attr('transform', 'translate(0,' + height + ')')
        .call(d3.axisBottom(x).tickFormat(d3.timeFormat('%Y')));
      svg.append('g')
        .attr('class', 'axis axis-y')
        .call(d3.axisLeft(y));
    }

    // Initialize the chart with the default month and indicator.
    updateChart(monthDropdown.property('value'), 
                climateIndicatorDropdown.property('value'), 
                regionDropdown.property('value'));

    // Add an event listener to the month selector dropdown.
    // This makes it so when the dropdown values change the graph is updated.
    monthDropdown.on('change', function() {
      const selectedMonth = d3.select(this).property('value');
      const selectedClimateIndicator = d3.select('#barchart-climateIndicator-select').property('value');
      const selectedRegion = d3.select('#barchart-region-select').property('value');
      updateChart(selectedMonth, selectedClimateIndicator, selectedRegion);
    });

    // Add an event listener to the climate indicator selector dropdown.
    // This makes it so when the dropdown values change the graph is updated.
    // It also updates the values in the region dropdown. This is necessary because
    // the data we have has different regions for each climate indicator.
    climateIndicatorDropdown.on('change', function() {
      const selectedMonth = d3.select('#barchart-month-select').property('value');
      const selectedClimateIndicator = d3.select(this).property('value');
      updateRegionDropdown();
      const selectedRegion = d3.select('#barchart-region-select').property('value');
      updateChart(selectedMonth, selectedClimateIndicator, selectedRegion);
    });

    // Add an event listener to the region dropdown.
    // this makes it so when the dropdown values change the graph is updated.
    regionDropdown.on('change', function() {
      const selectedMonth = d3.select('#barchart-month-select').property('value');
      const selectedClimateIndicator = d3.select('#barchart-climateIndicator-select').property('value');
      const selectedRegion = d3.select(this).property('value');
      updateChart(selectedMonth, selectedClimateIndicator, selectedRegion);
    });
  })
  .catch(error => {
    // Handle any errors that occur during loading.
    console.error(error);
  });
}
