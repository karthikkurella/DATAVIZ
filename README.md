# DATAVIZ

## Data

The `data` directory contains the cleaned data that is being visualized in our project.

- `all_data.json` contains the combined data of every file in the `raw_data` directory.

- `continents.svg` contains the visual map data of each region

The `rawData` directory contains the original files from which our data was obtained. All of this data was combined into `all_data.json`.

The `cleanData.js` script in the `js` directory was used to clean the data contained in the `rawData` directory.

## Visualizations

The `js` directory contains the code for all visualizations.

- `barchart.js` contains the bar chart.
- `lineChart.js` contains the line chart.
- `map.js` contains the map.

The js scripts require the code in their associated html file to work or index.html to work.

## Styling

The `css` directory contains all files regarding styling. 

## Run Instructions:

Clone the following git repository.

Github: https://github.com/karthikkurella/DATAVIZ

Run the command:  `git clone https://github.com/karthikkurella/DATAVIZ` to download the source code and launch with the following steps.

# Option 1. Run with VS Code Live Server Extension
- Open the project in the vscode:
- Launch the localhost with a desired port[5050] or use an extension Golive in vscode to open the code on the browser.
- Launch the `index.html` in your browser on localhost in order to view the main page with all the graphs in the local server.

# Option 2. Run with Python server
- Navigate to the root directory of the project in a terminal
- Run `python -m http.server` to start localhost. This will open up a python server on a port. You can also run `python -m http.server PORT_NUMBER` to specify the port.
- Navigate to `index.html` in your browser on localhost.


:warning: Recommended browsers Google Chrome, Edge.Functionality might be affected with locahost in Safari.
