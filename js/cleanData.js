// Set parameters for filename and data properties
// IMPORTANT change these two variables to match the data you want to clean
const climateIndicator = 'snowCover';
const region = 'northernHemisphere';

// Define the path to the JSON file
const filename = `${climateIndicator}_${region}_allMonths`;
const pathToJsonData = `../rawData/${filename}.json`;

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

    // add region and indicator properies to data
    data[key].region = region;

    data[key].climateIndicator = climateIndicator;

    // append object key with filename to ensure unique identifier across files
    data[`${key}_${filename}`] = data[key];
    delete data[key];
  }

  // Print the modified contents of the JSON file to the console
  console.log(data);

  
  const blob = new Blob([JSON.stringify(data, null, 2)], {type: "application/json"});
  const url = URL.createObjectURL(blob);
  console.log(url)
  const a = document.createElement("a");
  a.href = url;
  a.download = "cleanedData.json";
  a.click();
})
.catch(error => {
  // Handle any errors that occur during loading
  console.error(error);
});