function saveSettings() {
    const dataPointValues = {};
    const chartPointValues = {};
    const comPort = document.getElementById('ComPort').value;
    const numberOfData = document.getElementById('numberOfData').value;
    const SampleRate = document.getElementById('SampleRate').value;
    // Get selected data point values
    dataPoints.forEach((dataPoint, index) => {
        const selectedOption = dataPoint.dropdownDiv.querySelector('input:checked');
        const dataPointKey = 'data' + (index + 1);

        if (selectedOption) {
            dataPointValues[dataPointKey] = {
                value: selectedOption.value,
                id: selectedOption.id
            };
        }
    });

    // Get selected chart point values
    chartPoints.forEach((chartPoint, index) => {
        const selectedOption = chartPoint.dropdownDiv.querySelector('input:checked');
        const chartPointKey = 'chart' + (index + 1);

        if (selectedOption) {
            chartPointValues[chartPointKey] = {
                value: selectedOption.value,
                id: selectedOption.id
            };
        }
    });

    const jsonData = {
        dataPoints: dataPointValues,
        chartPoints: chartPointValues,
        comPort: comPort,
        numberOfData: numberOfData,
        SampleRate: SampleRate

    };

    ipcRenderer.send('run-script', 'savesettings', jsonData);
    ipcRenderer.once('script-done', () => {
        Load();
        stop();
    });
}

document.getElementById('myForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent form submission

    // Execute your function or perform desired actions here
    saveSettings();
    Settings.style.display = "none";
    card.style.display = 'none';
});