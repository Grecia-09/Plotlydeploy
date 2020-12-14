function init() {
  var selector = d3.select("#selDataset");

  d3.json("samples.json").then((data) => {
    console.log(data);
    var sampleNames = data.names;
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

     // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

init();

function optionChanged(newSample) {
  buildMetadata(newSample);
  buildCharts(newSample);
}

function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    var PANEL = d3.select("#sample-metadata");

    PANEL.html("");
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key}: ${value}`);
    });

  });
}
// 1. Create the buildCharts function.
function buildCharts(sample) {
// 2. Use d3.json to load and retrieve the samples.json file 
  d3.json("samples.json").then((data) => {
    // 3. Create a variable that holds the samples array.
    var samples = data.samples;

    // 4. Create a variable that filters the samples for the object with the desired sample number.
    var resultArray  = samples.filter(sampleObj => sampleObj.id == sample);

    //  5. Create a variable that holds the first sample in the array.
    var firstSample = resultArray[0];

    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    var otuIds = firstSample.otu_ids;
    var otuLabels = firstSample.otu_labels;
    var sampleValues = firstSample.sample_values;

    // 1. Create a variable that filters the metadata array for the object with the desired sample number.
    var mData = data.metadata;
    var resultFreq = mData.filter(freqObject => freqObject.id == sample);
  

    // 2. Create a variable that holds the first sample in the metadata array.
    var freqData = resultFreq[0];
    

    // 3. Create a variable that holds the washing frequency.
    var wFreq = freqData.wfreq;


    // 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    //  so the otu_ids with the most bacteria are last.   
    var yticks = otuIds.slice(0, 10).map(otuID => `OTU ${otuID}`).reverse();

    // 8. Create the trace for the bar chart. 
    var barData = [{
      y: yticks,
      x: sampleValues.slice(0, 10).reverse(),
      text: otuLabels.slice(0, 10).reverse(),
      type: "bar",
      orientation: "h",
    }
    ];

    // 9. Create the layout for the bar chart. 
    var barLayout = {
      title: "<b>Top 10 Bacteria Cultures Found<b>",
      margin: { t: 30, l: 150 }
    };
    
    // 10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot("bar", barData, barLayout);
  
    // 1. Create the trace for the bubble chart.
    var bubbleData = [{
      x: otuIds,
      y: sampleValues,
      text: otuLabels,
      mode: "markers",
      marker: {
        size: sampleValues,
        color: otuIds,
        colorscale: "Earth"
      }
    }];

    // 2. Create the layout for the bubble chart.
    var bubbleLayout = {
    title: "<b>Bacteria Cultures Per Sample<b>",
    margin: { t: 0 },
    hovermode: "closest",
    xaxis: { title: "OTU ID" },
    margin: { t: 30}
    };

    // 3. Use Plotly to plot the data with the layout.
    Plotly.newPlot("bubble", bubbleData, bubbleLayout); 
  
    // 4. Create the trace for the gauge chart.
    var gaugeData = [{
      domain: { x: [0, 1], y: [0, 1] },
      value: wFreq,
      title: {text: '<b>Belly Button Washing Frequency</b> <br> Scrubs per week'},
      type: "indicator",
      mode: "gauge+number",
      gauge: {
        axis: { range: [0, 10], tickwidth: 1, tickcolor: "black" },
        bar: { color: "black" },
        borderwidth: 2,
        bordercolor: "gray",
        steps: [
          { range: [0, 2], color: "red"},
						{ range: [2, 4], color: "orange"},
						{ range: [4, 6], color: "yellow"},
            { range: [6, 8], color: "lightgreen"},
            { range: [8, 10], color: "green"}
        ],               
      } 
    }];
    
    // 5. Create the layout for the gauge chart.
    var gaugeLayout = {width: 600, height: 500, margin: { t: 0, b: 0 } };
    
    // 6. Use Plotly to plot the gauge data and layout.
    Plotly.newPlot("gauge", gaugeData, gaugeLayout);

    function optionChanged(newSample) {
      buildMetadata(newSample);
      buildCharts(newSample);
    }

  });
}


    



