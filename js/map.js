// Define the path to the JSON file
const pathToJsonData = '../data/all_data.json';

// Use D3 to load the JSON file
d3.json(pathToJsonData)
.then(contents => {
//   Print the initial contents of the JSON file to the console
//   console.log(contents);
    
  function generateYears (){
    var dataset = [];                        
    for (var i = 1967; i < 2024; i++) {            
    dataset.push((i).toString());             
    }
    return dataset;
  }

  function getAverage(data){
    var sum=0;
    data.forEach(element => {

        sum+=element.value;
    });
    return sum/data.length;
  }
  // window.addEventListener("load", function() {
    const mapObject = document.getElementById('map').contentDocument;
    const map = mapObject.getElementById('external-1');
    const northAm=mapObject.getElementById('northAmerica');
    // console.log(northAm);
    const eurasia1=mapObject.getElementById('eurasia');
    const eurasia2=mapObject.getElementById('eurasia2');
  // });   

// Get the slider and value elements
const slider = document.getElementById("mySlider");
const sliderValue = document.getElementById("sliderValue");

// Set the initial value of the slider value
sliderValue.innerHTML = slider.value;
const initialPosition = (slider.value - slider.min) / (slider.max - slider.min) * 100;
sliderValue.style.left = `calc(${initialPosition}% )`;
   
    function drawScale(id, interpolator) {
      var data = Array.from(Array(100).keys());
  
      var cScale = d3.scaleSequential()
          .interpolator(interpolator)
          .domain([0,99]);
  
      var xScale = d3.scaleLinear()
          .domain([0,99])
          .range([0, 580]);
  
      var u = d3.select("#" + id)
          .selectAll("rect")
          .data(data)
          .enter()
          .append("rect")
          .attr("x", (d) => Math.floor(xScale(d)))
          .attr("y", 0)
          .attr("height", 25)
          .attr("width", (d) => {
              if (d == 99) {
                  return 6;
              }
              return Math.floor(xScale(d+1)) - Math.floor(xScale(d)) + 1;
           })
          .attr("fill", (d) => cScale(d));
    }
  
    drawScale("legend", d3.interpolateBlues);

    var svg = d3.select(".spectrum").append("svg").attr("width", 300);
    var myColor = d3.scaleSequential().domain([0,25])
    .interpolator(d3.interpolateBlues);
  
  // Define the function to update the map
  function updateMap(selectedYear) { 
    const filteredData = Object.values(contents).filter(d => {
      return d.year === selectedYear && d.climateIndicator === 'snowCover'}
    );
    
    const eurasiaData=filteredData.filter(d => {
        return d.region === 'eurasia'}
    );
    const northAmData=filteredData.filter(d => {
        return d.region === 'northAmericaGreenland'}
    );

    const eurasiaValue=getAverage(eurasiaData);
    const northAmValue=getAverage(northAmData);
    
    northAm.setAttribute('fill', myColor(northAmValue ? northAmValue:5));
    eurasia1.setAttribute('fill', myColor(eurasiaValue ? eurasiaValue : 5));
    eurasia2.setAttribute('fill', myColor(eurasiaValue ? eurasiaValue: 5));
   
    // console.log("africaData: ", africaData);
    // console.log("eurasiaData: ", eurasiaData);
    // console.log("namData: ", northAmData);
    // console.log("africaValue: ", africaValue);
    // console.log("eurasiaValue: ", eurasiaValue);
    // console.log("northAmValue: ", northAmValue);
    // console.log("northAm: ", northAmData);
    }

  updateMap(sliderValue);

    // Update the slider value and position as the user moves the thumb
  slider.oninput = function() {
    sliderValue.innerHTML = this.value;
    const thumbPosition = (this.value - this.min) / (this.max - this.min) * 100;
    sliderValue.style.left = `calc(${thumbPosition}% )`;

    const selectedYear = d3.select(this).property('value');
    updateMap(selectedYear);
}

})
.catch(error => {
  // Handle any errors that occur during loading
  console.error(error);
});
