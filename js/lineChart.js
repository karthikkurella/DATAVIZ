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

    // Create SVG container
    const margin = {top: 20, right: 20, bottom: 30, left: 50},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

    var x = d3.scaleLinear()
        .range([0, width]);

    var y = d3.scaleLinear()
        .range([height, 0]);

    const svg = d3.select("#line-chart")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // Define the function to update the chart
    function updateLinechart(selectedMonth) {
        // Get the new relevant data to plot based on new filter
        const filteredData1 = Object.values(contents).filter(d => {
            monthNum = monthNameToNum[selectedMonth];
            return d.month === monthNum && d.climateIndicator === 'snowCover' && d.region === "northAmerica"});

        const filteredData2 = Object.values(contents).filter(d => {
            monthNum = monthNameToNum[selectedMonth];
            return d.month === monthNum && d.climateIndicator === 'seaIce' && d.region === "northernHemisphere"});
            //console.log(filteredData2);

        // console.log(filteredData1);
        x.domain(d3.extent(filteredData1, d => d.year));
        const max1 = d3.max(filteredData1, d => d.value)
        const max2 = d3.max(filteredData2, d => d.value)
        y.domain([0, d3.max([max1, max2])]);

        var createLine = d3.line()
            .x(d => x(d.year))
            .y(d => y(d.value));

        var x_axis = d3.axisBottom().scale(x);

        var y_axis = d3.axisLeft().scale(y);

        // replace all lines with ones for new data
        svg.selectAll('.line').remove();
        svg.selectAll('.line')
            .data(filteredData1)
            .enter().append('path')
            .attr('class', 'line')
            .attr('x', d => x(d.year))
            .attr("stroke", "white")
            .attr('stroke-width', "2")
            .attr("fill", "none")
            .attr("d", createLine(filteredData1))

        svg.selectAll('.line')
            .data(filteredData2)
            .enter().append('path')
            .attr('class', 'line')
            .attr('x', d => x(d.year))
            .attr("stroke", "#2B4C7F")
            .attr('stroke-width', "1")
            .attr("fill", "none")
            .attr("d", createLine(filteredData2))

        // replace all axes with the ones for the new data
        svg.selectAll('.axis').remove();
        svg.append('g')
            .attr('class', 'axis axis-x')
            .attr('transform', 'translate(0,' + height + ')')
            .call(x_axis);
        svg.append('g')
            .attr('class', 'axis axis-y')
            .call(y_axis);
        }

    // Initialize the chart with the default month and indicator
    updateLinechart(monthDropdown.property('value'), );

    // Add an event listener to the month selector dropdown
    // this makes it so when the dropdown values change the graph is updated
    monthDropdown.on('change', function() {
        const selectedMonth = d3.select(this).property('value');
        updateLinechart(selectedMonth);
    });
})
.catch(error => {
    console.error(error);
});