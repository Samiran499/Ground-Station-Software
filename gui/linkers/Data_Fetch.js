let Rx = false;
const flight_data = new Array();
const chartValues = [];
const chartID = [];
const AdataID = [];
const DdataID = [];
let comport;
let numAdata;
let numDdata;
let samplerate;

async function loadData() {
    const response = await fetch('C:/rtgs/conf.json');
    const data = await response.json();
    const extractedADataID = {};
    const extractedDDataID = {};
    const extractedChartPoint = {};
    const extractedChartID = {};

    for (const key in data.chartPoints) {
        extractedChartPoint[key] = data.chartPoints[key].value;
    }
    for (const key in data.chartPoints) {
        extractedChartID[key] = data.chartPoints[key].id;
    }
    extractedComPort = data.comPort;
    extractedANumData = data.numberOfAData;
    extractedDNumData = data.numberOfDData;
    extractedSampleRate = data.SampleRate;
    for (const key in data.AdataPoints) {
        extractedADataID[key] = data.AdataPoints[key].id;
    }
    for (const key in data.DdataPoints) {
        extractedDDataID[key] = data.DdataPoints[key].id;
    }


    return { extractedADataID, extractedDDataID, extractedChartID, extractedChartPoint, extractedANumData, extractedDNumData, extractedComPort, extractedSampleRate };
}

function Load() {
    loadData()
        .then(data => {
            chartID.length = 0;
            AdataID.length = 0;
            DdataID.length = 0;
            chartValues.length = 0;
            chartValues.push(data.extractedChartPoint);
            chartID.push(data.extractedChartID);
            AdataID.push(data.extractedADataID);
            DdataID.push(data.extractedDDataID);
            comport = data.extractedComPort;
            numAdata = data.extractedANumData;
            numDdata = data.extractedDNumData;
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
                    flight_data.push(data);
                    updateChart(data);
                    ACCX_s.innerHTML = data.accx + " m/sec2";
                    ACCZ_s.innerHTML = data.accz + " m/sec2";
                    ACCY_s.innerHTML = data.accy + " m/sec2";
                    ALT_s.innerHTML = data.alt + " m";
                    GYTOX_s.innerHTML = data.gyrox + " deg";
                    GYTOY_s.innerHTML = data.gyroy + " deg";
                    GYTOZ_s.innerHTML = data.gyroz + " deg";
                    TEMP_s.innerHTML = data.temp + " C";
                    VEL_s.innerHTML = data.vel + " m/sec";
                    if (data.lat_deg != undefined) {
                        LAT_s.innerHTML = data.lat_deg + " deg " + data.lat_min + " min " + data.lat_sec + " sec " + data.lat_hem;
                        LONG_s.innerHTML = data.long_deg + " deg " + data.long_min + " min " + data.long_sec + " sec " + data.long_hem;
                    }
                    TIME_s.innerHTML = data.time / 1000 + " sec";
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