let co = require('co');
let generate = require('node-chartist');
var fs = require('fs');

const STATUSES = ['ToDo', 'Assigned', 'In Progress', 'Review', 'Resolved', 'Testing', 'Ready', 'Released'];
function makeLines(data) {
    co(() => {
        const options = {
            width: 800,
            height: 300,
            axisX: {title: 'X Axis (units)'},
            axisY: {title: 'Y Axis (units)'},
            scaleMinSpace: 20,
            onlyInteger: true,
            ticks: [0, 3, 5, 10, 12]
        };

        generate('line', options, {
            labels: STATUSES,
            series: data
        }).then(saveFile);
    });
}

function saveFile(data) {
    const pref = `<link  rel="stylesheet" href="./node_modules/chartist/dist/chartist.css">`;

    fs.writeFile('./report.html', pref + data, function(err) {
        if (err) {
            return console.log(err);
        }

        console.log('The file was saved!');
    });
}

module.exports = makeLines;
