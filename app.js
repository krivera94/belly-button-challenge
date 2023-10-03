const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";

d3.json(url).then(function(data) {

    function buildChartsAndMetadata(id) {
        
        const sample = data.samples.find(s => s.id === id);

        const sample_values = sample.sample_values.slice(0, 10).reverse();
        const otu_ids = sample.otu_ids.slice(0, 10).reverse().map(otuID => `OTU ${otuID}`);
        const otu_labels = sample.otu_labels.slice(0, 10).reverse();

        const barData = [{
            type: 'bar',
            x: sample_values,
            y: otu_ids,
            text: otu_labels,
            orientation: 'h',
            marker: {
                color: '#FFC0CB' 
            }
        }];
        
        const barLayout = {
            title: 'Top 10 OTUs'
        };
        Plotly.newPlot("bar", barData, barLayout);

        const bubbleData = [{
            x: sample.otu_ids,
            y: sample.sample_values,
            text: sample.otu_labels,
            mode: 'markers',
            marker: {
                size: sample.sample_values,
                color: sample.otu_ids,
                colorscale: 'Earth'
            }
        }];
        const bubbleLayout = {
            title: 'Sample OTU IDs vs. Sample Values',
            xaxis: { title: 'OTU ID' },
            yaxis: { title: 'Sample Values' },
            hovermode: 'closest'
        };
        Plotly.newPlot("bubble", bubbleData, bubbleLayout);

        const metadata = data.metadata.find(meta => meta.id.toString() === id);
        const metadataPanel = d3.select("#sample-metadata");
        metadataPanel.html(""); 
        Object.entries(metadata).forEach(([key, value]) => {
            metadataPanel.append("h6").text(`${key}: ${value}`);
        });
    }

    const select = d3.select("#selDataset");
    data.names.forEach(name => {
        select.append("option").text(name);
    });

    buildChartsAndMetadata(data.names[0]);

    window.optionChanged = function(value) {
        buildChartsAndMetadata(value);
    }
});