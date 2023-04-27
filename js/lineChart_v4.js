const pathToJsonData = '../data/all_data.json';

d3.json(pathToJsonData)
.then(contents => {

    // create months to fill dropdown
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

    // Create a dictionary to easily convert from name to number
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

    // Create SVG container
    const margin = {top: 20, right: 20, bottom: 30, left: 50},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

    var x = d3.scaleTime()
        .range([0, width])
        // .padding(0.1);
    
    // const x = d3.scaleBand()
    //     .range([0, width])
    //     .padding(0.1);

    var y = d3.scaleLinear()
        .range([height, 0]);

    const svg = d3.select("#line-chart")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // Define the function to update the chart
    function updateChart(selectedMonth, selectedClimateIndicator) {
        // Get the new relevant data to plot based on new filter
        const filteredData = Object.values(contents).filter(d => {
            monthNum = monthNameToNum[selectedMonth];
            climateIndicatorValue = climateIndicatorLabelToValue[selectedClimateIndicator];
            return d.month === monthNum && d.climateIndicator === climateIndicatorValue}
        );

        var parseTime = d3.timeParse();

        filteredData.forEach(function(filteredData) {
            filteredData.date = parseTime(filteredData.date);
        });
        
        x.domain(d3.extent(filteredData, d => d.date))
        y.domain([0, d3.max(filteredData, d => d.value)])

        var createLine = d3.line()
            .x(d => x(d.date))
            .y(d => y(d.value));

        var x_axis = d3.axisBottom().scale(x);

        var y_axis = d3.axisLeft().scale(y);

        // replace all axis with the ones for the new data
        svg.selectAll('.axis').remove();
        svg.append('g')
            .attr('class', 'axis axis-x')
            .attr('transform', 'translate(0,' + height + ')')
            .call(x_axis);
        svg.append('g')
            .attr('class', 'axis axis-y')
            .call(y_axis);

        svg.append("path")
            .attr("stroke", "black")
            .attr('stroke-width', "1")
            .attr("fill", "none")
            .attr("d", createLine(filteredData))
            // .attr("d", createLine(filteredData, {return d.climateIndicator == "snowCover"}))

        }

    // Initialize the chart with the default month and indicator
    updateChart(monthDropdown.property('value'), climateIndicatorDropdown.property('value'));

    // Add an event listener to the month selector dropdown
    // this makes it so when the dropdown values change the graph is updated
    monthDropdown.on('change', function() {
        const selectedMonth = d3.select(this).property('value');
        const selectedClimateIndicator = d3.select("#climateIndicator-select").property('value');
        updateChart(selectedMonth, selectedClimateIndicator);
    });

    // Add an event listener to the climate indicator selector dropdown
    // this makes it so when the dropdown values change the graoh is updated
    climateIndicatorDropdown.on('change', function() {
        const selectedMonth = d3.select('#month-select').property('value');
        const selectedClimateIndicator = d3.select(this).property('value');
        updateChart(selectedMonth, selectedClimateIndicator);
    });
})
.catch(error => {
    console.error(error);
});