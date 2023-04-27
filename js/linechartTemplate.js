// Line Chart
// I don't know how to do this :)
const pathToJsonData = '../data/all_data.json';

var svgHeight = 650;
var svgWidth = 1000;

var margin = {
    top: 20,
    right: 20,
    bottom: 30,
    left: 50,
};

// Define the function to update the chart
function updateChart(selectedMonth, selectedClimateIndicator) {
    const filteredData = Object.values(contents).filter(d => {
        monthNum = monthNameToNum[selectedMonth];
        climateIndicatorValue = climateIndicatorLabelToValue[selectedClimateIndicator];
        return d.month === monthNum && d.climateIndicator === climateIndicatorValue}
        );
}

const width = svgWidth - margin.left - margin.right;
const height = svgHeight - margin.top - margin.bottom;

var svg = d3.select('#line-chart')
    .append('svg')
    .attr('width', svgWidth)
    .attr('height', svgHeight);

var chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.right}, ${margin.bottom})`);

// var chartGroup = svg.append("g")
//     .attr("transform", `translate(${margin.left}, ${margin.top})`);

d3.json(pathToJsonData)
    .then(contents => {

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

        //Select the dropdown element and populate it with months
        const monthDropdown = d3.select('#month-select');
        monthDropdown.selectAll('option')
          .data(months)
          .enter()
          .append('option')
          .text(d => d)
          .attr('value', d => d);

        // Set the first dropdown option as the default (if there are options)
        if(monthDropdown.select('option').size() > 0) {
            monthDropdown.property('selectedIndex', 0);
        }

        // Create climate indicators to fill dropdown
        const climateIndicators = [
            'Sea Ice',
            'Snow Cover'
        ]

        // Create dictionary to easily convert from label to value format
        const climateIndicatorLabelToValue = {
            'Sea Ice' : 'seaIce',
            'Snow Cover' : 'snowCover'
        }

        // select the dropdown element and populate it with months
        const climateIndicatorDropdown = d3.select('#climateIndicator-select');
        climateIndicatorDropdown.selectAll('option')
            .data(climateIndicators)
            .enter()
            .append('option')
            .text(d => d)
            .attr('value', d => d);

        // Set the first dropdown option as the default (if there are other options)
        if (climateIndicatorDropdown.select('option').size() > 0) {
            climateIndicatorDropdown.property('selectedIndex', 0);
        }

        // console.log(filteredData);

        // change the x and y domains to fit the new data
        x.domain(filteredData.map(d => d.year));
        y.domain([0, d3.max(filteredData, d => d.value)]);

        // var numberOfRows = data.length;
        // console.log(numberOfRows);

        // var columnNames = data.columns;
        // console.log(columnNames);

        // var numberOfCols = 5;

        // replace all points with the ones for the new data

        data.forEach(function(filteredData) {
            filteredData.value = +filteredData.value;
            filteredData.year = parseFloat(filteredData.year);
        });

        var xScale = d3.scaleTime()
            .domain(d3.extent(filteredData, d => d.year))
            .range([10, width]);

        var yScale = d3.scaleLinear()
            .domain([0, d3.max(filteredData, d => d.value)])
            .range([height, 0]);

        var createLine = d3.line()
            .x(filteredData => xScale(filteredData.year))
            .y(filteredData => yScale(filteredData.value));

        var x_axis = d3.axisBottom()
            .scale(xScale);

        var y_axis = d3.axisLeft()
            .scale(yScale)

        chartGroup.append("g")
            .attr("transform", `translate(0, ${height})`)
            .call(x_axis);

        chartGroup.append("g")
            .attr("transform", `translate(0, ${margin.left})`)
            .call(y_axis);

        chartGroup.append("path")
            .attr("stroke", "black")
            .attr("stroke-width", "1")
            .attr("fill", "none")
            .attr("d", createLine(filteredData));

        // Initialize the chart with the default month and indicator
        updateChart(monthDropdown.property('value'), climateIndicatorDropdown.property('value'));

        // Add an event listener to the month selector dropdown
        // this makes it so when the dropdown values change the graph is updated
        climateIndicatorDropdown.on('change', function() {
            const selectedMonth = d3.select('#month-select').property('value');
            const selectedClimateIndicator = d3.select(this).property('value');
            updateChart(selectedMonth, selectedClimateIndicator);
        });
        // chartGroup.append("text") 
    }).catch(function(error) {
        console.log(error)
    });