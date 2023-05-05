{
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

        const monthDropdown = d3.select('#linechart-month-select');
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
        const margin = {top: 20, right: 20, bottom: 30, left: 20},
        width = 960 - margin.left - margin.right,
        height = 400 - margin.top - margin.bottom;

        var x = d3.scaleLinear()
            .range([0, width]);

        var y = d3.scaleLinear()
            .range([height, 0]);

        const svg = d3.select("#linechart")
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
                return d.month === monthNum && d.climateIndicator === 'snowCover' && d.region === "eurasia" && d.value > 0;});

            const filteredData2 = Object.values(contents).filter(d => {
                monthNum = monthNameToNum[selectedMonth];
                return d.month === monthNum && d.climateIndicator === 'seaIce' && d.region === "northernHemisphere" && d.value > 0;});
                //console.log(filteredData2);

            // console.log(filteredData1);
            const maxYear = d3.min([d3.max(filteredData1, d => d.year), d3.max(filteredData2, d => d.year)]);
            const minYear = d3.max([d3.min(filteredData1, d => d.year), d3.min(filteredData2, d => d.year)]);
            x.domain([minYear, maxYear]);
            const max1 = d3.max(filteredData1, d => d.value)
            const max2 = d3.max(filteredData2, d => d.value)
            y.domain([0, d3.max([max1, max2]) + 5]);

            const domainFilteredData1 = Object.values(filteredData1).filter(d => {
                return d.year > minYear && d.year < maxYear;
            });

            const domainFilteredData2 = Object.values(filteredData2).filter(d => {
                return d.year > minYear && d.year < maxYear;
            });

            var createLine = d3.line()
                .x(d => x(d.year))
                .y(d => y(d.value));

            var x_axis = d3.axisBottom().scale(x);

            var y_axis = d3.axisLeft().scale(y);

            // replace all lines with ones for new data
            svg.selectAll('.line').remove();
            svg.selectAll('.line')
                .data(domainFilteredData1)
                .enter().append('path')
                .attr('class', 'line')
                .attr('x', d => x(d.year))
                .attr("stroke", "black")
                .attr('stroke-width', "2")
                .attr("fill", "none")
                .attr("d", createLine(domainFilteredData1))

            svg.selectAll('.line2')
                .data(domainFilteredData2)
                .enter().append('path')
                .attr('class', 'line')
                .attr('x', d => x(d.year))
                .attr("stroke", "#2B4C7F")
                .attr('stroke-width', "1")
                .attr("fill", "none")
                .attr("d", createLine(domainFilteredData2))

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
            // create legend
            const legend = svg.append('g')
            .attr('class', 'legend')
            .attr('transform', 'translate(' + (width - 100) + ', 10)');

            // add line1 legend
            legend.append('rect')
            .attr('x', 0)
            .attr('y', 0)
            .attr('width', 10)
            .attr('height', 10)
            .style('fill', 'black');
            legend.append('text')
            .attr('x', 15)
            .attr('y', 10)
            .text('snowCover');

            // add line2 legend
            legend.append('rect')
            .attr('x', 0)
            .attr('y', 20)
            .attr('width', 10)
            .attr('height', 10)
            .style('fill', '#2B4C7F');
            legend.append('text')
            .attr('x', 15)
            .attr('y', 30)
            .text('seaIce');

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
}