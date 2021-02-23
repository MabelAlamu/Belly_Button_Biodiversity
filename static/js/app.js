function init(){
    d3.json("samples.json").then(incomingData => {

        var otu_data = incomingData;
            // console.log(otu_data);

        //Add ids to Test Subject ID No. dropdown menu
        var id_names = otu_data.names;
        var dropdown = d3.select("#selDataset");
        
        id_names.forEach(id => {
            var option = dropdown.append("option");
            option.text(id);
            option.property('value', id);
        });

        charts(otu_data.names[0]);
        demographicBox(otu_data.names[0]);
    });
}
init();

function optionChanged(id){
    charts(id);
    demographicBox(id);
};

function charts(id) {
   d3.json("samples.json").then(incomingData => {
        var otu_data = incomingData;
            // console.log(otu_data);
        
        var values = otu_data.samples.filter(value => value.id.toString() === id)[0].sample_values;
            // console.log(values);

        var ids = otu_data.samples.filter(otu => otu.id.toString() === id)[0].otu_ids;
            // console.log(ids);

        // Slice the top 10 OTU values, labels and ids
        var topOTU = (values.slice(0, 10)).reverse();
            // console.log(topOTU);
        var hoverText = otu_data.samples.filter(label => label.id.toString() === id)[0].otu_labels.slice(0, 10);
            // console.log(hoverText)
        var OTU_ids = (ids.slice(0,10))
                        .reverse()
                        .map(id => `OTU ${id}`);
            // console.log(OTU_ids);
        
        //Creating the horizontal bar chart that displays the top 10 OTUs found each individual
        var trace1 = {
            type: "bar",
            orientation: 'h',
            x: topOTU,
            y: OTU_ids,
            marker: {color: 'black'},
            hovertext: hoverText
        };

        var data = [trace1];

        var layout = {
            title: `Top 10 OTUs found in ${id}`
        };

        Plotly.newPlot('bar', data, layout);
        
        //Creating the bubble chart that displays each sample
        var trace2 = {
            type: "bubble",
            x: ids,
            y: values,
            mode: 'markers',
            marker: {
                size: values,
                color: ids
            },
            text: otu_data.samples[0].otu_labels
        };

        var data2 = [trace2];

        Plotly.newPlot('bubble', data2);
   });

};


function demographicBox(id){
    //Adding individual's demographic information to the demographic info box
    d3.json("samples.json").then(incomingData => {
        var otu_data = incomingData;
        // console.log(otu_data);

        var demographicInfo = otu_data.metadata;
        // console.log(demographicInfo);

        var individualInfo = demographicInfo.filter(info => info.id.toString() === id)[0];

        var infoBox = d3.select("#sample-metadata");
        infoBox.html("");
        
        //Appending demographic info to the panel
        Object.entries(individualInfo).forEach(([key, value ])=> {   
            infoBox.append("p").text(`${key}: ${value}`);    
        });

    });
};




    

