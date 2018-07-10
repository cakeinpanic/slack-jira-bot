const generate = require('node-chartist');
const fs = require('fs');

function createLinesChart(series, labels, filename = 'log') {
    const options = {
        width: 800,
        height: 300,
        axisX: {title: 'X Axis (units)'},
        axisY: {title: 'Y Axis (units)'},
        scaleMinSpace: 20,
        onlyInteger: true,
        ticks: [0, 3, 5, 10, 12]
    };

    return generate('line', options, {
        labels,
        series
    }).then(data => saveFile(data, filename));
}

function saveFile(data, filename) {
    const pref = `<link  rel="stylesheet" href="./node_modules/chartist/dist/chartist.css">`;

    fs.writeFile(`./${filename}.html`, pref + data, function(err) {
        if (err) {
            return console.log(err);
        }

        console.log('The file was saved!');
    });
}

module.exports = createLinesChart;
