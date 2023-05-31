let Rx = false;
const flight_data = new Array();
const chartValues = [];
const chartID = [];
const dataID = [];
let comport;
let numdata;
let samplerate;

async function loadData() {
    const response = await fetch('C:/rtgs/conf.json');
    const data = await response.json();
    const extractedDataID = {};
    const extractedChartPoint = {};
    const extractedChartID = {};

    for (const key in data.chartPoints) {
        extractedChartPoint[key] = data.chartPoints[key].value;
    }
    for (const key in data.chartPoints) {
        extractedChartID[key] = data.chartPoints[key].id;
    }
    extractedComPort = data.comPort;
    extractedNumData = data.numberOfData;
    extractedSampleRate = data.SampleRate;
    for (const key in data.dataPoints) {
        extractedDataID[key] = data.dataPoints[key].id;
    }


    return { extractedDataID, extractedChartID, extractedChartPoint, extractedNumData, extractedComPort, extractedSampleRate };
}

function Load() {
    loadData()
        .then(data => {
            chartID.length = 0;
            dataID.length = 0;
            chartValues.length = 0;
            chartValues.push(data.extractedChartPoint);
            chartID.push(data.extractedChartID);
            dataID.push(data.extractedDataID);
            comport = data.extractedComPort;
            numdata = data.extractedNumData;
            samplerate = data.extractedSampleRate;
            loadChartLabel();
        })
}
Load();

let checktime = 0;
setInterval(() => {

    if (Rx === true) {

        fetch('C:/rtgs/data.json')
            .then(response => response.json())
            .then(data => {

                if (checktime !== data.time) {
                    checktime = data.time;
                    flight_data.push(data)
                    updateChart(data)
                    RACC_s.innerHTML = data.racc + " m/sec2";
                    RALT_s.innerHTML = data.ralt + " m";
                    KALT_s.innerHTML = data.kalt + " m";
                    KACC_s.innerHTML = data.kacc + " m/sec2";
                    KVEL_s.innerHTML = data.kvel + " m/sec";
                    TIME_s.innerHTML = data.time / 1000 + " sec";
                    if (data.state === 4) {
                        PYRO_s.innerHTML = "ON";
                    }
                    if (Pyro_Obj.hasOwnProperty(data.pyro)) {
                        PYRO_s.innerHTML = Pyro_Obj[data.pyro];
                    }
                    if (State_Obj.hasOwnProperty(data.state)) {
                        STATE_s.innerHTML = State_Obj[data.state];
                    }

                }
            })
            .catch(error => {

            });
    }
}, 200);