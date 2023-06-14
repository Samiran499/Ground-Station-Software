const { ipcRenderer } = require('electron');

/// THIS IS BUTTON CREATION 
const containers = document.getElementById('button');

const ButtonDatas = [{
    title: 'Save',
    id: 'save'
}, {
    title: 'Stop',
    id: 'stop'
}, {
    title: 'Clear',
    id: 'clear_graph'
}];

ButtonDatas.forEach(items => {
    const newButton = document.createElement("button");
    newButton.classList.add('button');
    newButton.textContent = items.title;
    newButton.id = items.id;
    newButton.setAttribute("onclick", items.id + "()");
    containers.appendChild(newButton);
});


// FROM HERE ,BUTTON FUNCTIONS 


Start_Enable = true; //this enables start button

document.getElementById('START').addEventListener('click', () => {
    if (Start_Enable == true) {
        Start_Enable = false; // this disables start button
        Rx = true; // this enables array update (data recieving)
        ipcRenderer.send('run-script', 'start'); // sends command to start python scrpit
    }
});

document.getElementById('PYRO').addEventListener('click', () => {
    ipcRenderer.send('run-script', 'pyro'); // sends command to start python scrpit
});

function stop() {
    Start_Enable = true;
    Rx = false;
    descent_par = false;
    ipcRenderer.send('run-script', 'stop');
}

function clear_graph() {
    console.log("clear")
    while (chart1.data.datasets[0].data.length > 0) {
        chart1.data.datasets[0].data.pop()
        chart2.data.datasets[0].data.pop()
        chart3.data.datasets[0].data.pop()
        chart4.data.datasets[0].data.pop()
        chart1.data.labels.pop()
        chart2.data.labels.pop()
        chart3.data.labels.pop()
        chart4.data.labels.pop()
        chart1.update()
        chart2.update()
        chart3.update()
        chart4.update()
    }
}

function save() {

    // Convert data to CSV string
    const newLine = String.fromCharCode(10);
    let csv = '';

    csv += 'TIME ,State,Raw Acceleration,Raw Altitude,Kalman Altitude,Kalman Velocity,Kalman Acceleration' + newLine;
    flight_data.forEach((point) => {
        csv += point.time + ',' + point.state + ',' + point.racc + ',' + point.ralt + ',' + point.kalt + ',' + point.kvel + ',' + point.kacc + newLine;
    });

    // Create download link
    const link = document.createElement('a');
    link.download = 'data.csv';
    link.href = 'data:text/csv;charset=utf-8,' + encodeURI(csv);
    link.style.display = 'none';
    document.body.appendChild(link);

    // Click download link
    link.click();

    // Cleanup
    document.body.removeChild(link);

}