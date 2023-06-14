// CHART CREATION

const Canvas1 = document.getElementById("CHART1");
const Canvas2 = document.getElementById("CHART2");
const Canvas3 = document.getElementById("CHART3");
const Canvas4 = document.getElementById("CHART4");

const chart1 = new Chart(Canvas1, {
    type: "line", // set the type of chart1 (in this case, a line chart1)

    data: {
        labels: [0], // initialize an empty array of labels
        datasets: [{
            label: "", // set the label for the data
            data: [], // initialize an empty array of data points
            borderColor: "red", // set the color of the line
            radius: 1,
            fill: true, // don't fill in the area under the line
        }, ],
    },
});
const chart2 = new Chart(Canvas2, {
    type: "line", // set the type of chart1 (in this case, a line chart1)
    data: {
        labels: [0], // initialize an empty array of labels
        datasets: [{
            label: "", // set the label for the data
            data: [], // initialize an empty array of data points
            radius: 1,
            borderColor: "black", // set the color of the line
            fill: true, // don't fill in the area under the line
        }, ],
    },
});
const chart3 = new Chart(Canvas3, {
    type: "line", // set the type of chart1 (in this case, a line chart1)
    data: {
        labels: [0], // initialize an empty array of labels
        datasets: [{
            label: "", // set the label for the data
            data: [], // initialize an empty array of data points
            borderColor: "blue", // set the color of the line
            radius: 1,
            fill: true, // don't fill in the area under the line
        }, ],
    },
});
const chart4 = new Chart(Canvas4, {
    type: "line", // set the type of chart1 (in this case, a line chart1)
    data: {
        labels: [0], // initialize an empty array of labels
        datasets: [{
            label: "", // set the label for the data
            data: [], // initialize an empty array of data points
            borderColor: "blue", // set the color of the line
            radius: 1,
            fill: true, // don't fill in the area under the line
        }, ],
    },
});

function loadChartLabel() {

    chart1.data.datasets[0].label = Config[0].IncomingData[chartValues[0].chart1].label + " (" + Config[0].IncomingData[chartValues[0].chart1].unit + ")";
    chart2.data.datasets[0].label = Config[0].IncomingData[chartValues[0].chart2].label + " (" + Config[0].IncomingData[chartValues[0].chart2].unit + ")";
    chart3.data.datasets[0].label = Config[0].IncomingData[chartValues[0].chart3].label + " (" + Config[0].IncomingData[chartValues[0].chart3].unit + ")";
    chart4.data.datasets[0].label = Config[0].IncomingData[chartValues[0].chart4].label + " (" + Config[0].IncomingData[chartValues[0].chart4].unit + ")";
    chart1.update();
    chart2.update();
    chart3.update();
    chart4.update();
}
// CHART UPDATION

let l = 0

function updateChart(newData) {
    l += 1
    console.log("update chart")
    console.log(chartValues[0].chart3)
    chart1.data.labels.push(newData.time / 1000);
    chart1.data.datasets[0].data.push(newData[chartValues[0].chart1]);
    chart1.update();
    chart2.data.labels.push(newData.time / 1000);
    chart2.data.datasets[0].data.push(newData[chartValues[0].chart2]);
    chart2.update();
    chart3.data.labels.push(newData.time / 1000);
    chart3.data.datasets[0].data.push(newData[chartValues[0].chart3]);
    chart3.update();
    chart4.data.labels.push(newData.time / 1000);
    chart4.data.datasets[0].data.push(newData[chartValues[0].chart4]);
    chart4.update();
    if (l > 300) {
        chart1.data.datasets[0].data.shift()
        chart2.data.datasets[0].data.shift()
        chart3.data.datasets[0].data.shift()
        chart4.data.datasets[0].data.shift()
        chart1.data.labels.shift();
        chart2.data.labels.shift();
        chart3.data.labels.shift();
        chart4.data.labels.shift();
    }
}

// LABEL CREATION

const container = document.getElementById('box');

// Create an array of data for the cards
const LabelData = [{
    title: 'ALTITUDE',
    text: '0',
    id: 'ALT'
}, {
    title: 'Acceleration X',
    text: '0',
    id: 'ACCX'
}, {
    title: 'Acceleration Y',
    text: '0',
    id: 'ACCY'
}, {
    title: 'Acceleration Z',
    text: '0',
    id: 'ACCZ'
}, {
    title: 'VELOCITY ',
    text: '0',
    id: 'VEL'
}, {
    title: 'GYRO X',
    text: '0',
    id: 'GYROX'
}];

const LabelDataBottom = [{
    title: 'GYRO Y',
    text: '0',
    id: 'GYROY'
}, {
    title: 'GYRO Z',
    text: '0',
    id: 'GYROZ'
}, {
    title: 'LATITUDE',
    text: "14 deg 2 min 5 sec E ",
    id: 'LAT'
}, {
    title: 'LONGITUDE',
    text: "14 deg 2 min 5 sec E ",
    id: 'LONG'
}];

// Loop through the data and create a card for each item
LabelData.forEach(item => {
    // Create a new card element
    const label = document.createElement('div');
    label.classList.add('e_one');

    // Create a heading element and add it to the card
    const heading = document.createElement('h2');
    heading.textContent = item.title;
    label.appendChild(heading);

    // Create a paragraph element and add it to the card
    const paragraph = document.createElement('p');
    paragraph.id = item.id;
    paragraph.textContent = item.text;
    label.appendChild(paragraph);

    // Add the card to the container
    container.appendChild(label);
});
// get a reference to the canvas element

const Bottomcontainer = document.getElementById('bottombox');
// Loop through the data and create a card for each item
LabelDataBottom.forEach(item => {
    // Create a new card element
    const label = document.createElement('div');
    label.classList.add('be_one');

    // Create a heading element and add it to the card
    const heading = document.createElement('h2');
    heading.textContent = item.title;
    label.appendChild(heading);

    // Create a paragraph element and add it to the card
    const paragraph = document.createElement('p');
    paragraph.id = item.id;
    paragraph.textContent = item.text;
    label.appendChild(paragraph);

    // Add the card to the container
    Bottomcontainer.appendChild(label);
});
// get a reference to the canvas element

const ACCX_s = document.getElementById("ACCX");
const ACCZ_s = document.getElementById("ACCZ");
const ACCY_s = document.getElementById("ACCY");
const ALT_s = document.getElementById("ALT");
const GYTOX_s = document.getElementById("GYROX");
const GYTOY_s = document.getElementById("GYROY");
const GYTOZ_s = document.getElementById("GYROZ");
const TEMP_s = document.getElementById("TEMP");
const VEL_s = document.getElementById("VEL");
const LAT_s = document.getElementById("LAT");
const LONG_s = document.getElementById("LONG");
const TIME_s = document.getElementById("TIME");
const STATE_s = document.getElementById("STATE");
const PYRO_s = document.getElementById("PYRO_STATUS");

const Pyro_Obj = {
    '0': "OFF",
    '1': "ON"
}

const State_Obj = {
    '0': "IDLE",
    '1': "POWERED ASCENT",
    '2': "COASTING",
    '3': "DESCENT",
    '4': "DROGUE OUT",
    '5': "MAIN OUT",
    '7': "TOUCHDOWN",
    '6': "TOUCHDOWN IDLE"
}