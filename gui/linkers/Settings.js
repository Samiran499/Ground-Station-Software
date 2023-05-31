//Settings Control
const Settings = document.getElementById('SETTINGS')

function settings() {
    Settings.style.display = "flex";
    card.style.display = 'flex';
    document.body.style.overflow = 'hidden';
    document.getElementById('ComPort').value = comport;
    document.getElementById('numberOfData').value = numdata;
    document.getElementById('SampleRate').value = samplerate;
    createDataPoints();
    for (const key in dataID[0]) {
        document.getElementById(dataID[0][key]).click()
    }
    for (const key in chartID[0]) {
        document.getElementById(chartID[0][key]).click()
    }
}

function closeCard() {
    const card = document.getElementById('card');
    Settings.style.display = "none";
    card.style.display = 'none';
    document.body.style.overflow = 'auto'; // Restore scrollbars when the card is closed
}

var Config = [{
    "IncomingData": {
        "kacc": {
            "label": "Kalman Acceleration",
            "unit": "m/sec2"
        },
        "kvel": {
            "label": "Kalman Velocity",
            "unit": "m/s"
        },
        "kalt": {
            "label": "Kalman Altitude",
            "unit": "m"
        },
        "racc": {
            "label": "Raw Acceleration",
            "unit": "m/sec2"
        },
        "ralt": {
            "label": "Raw Altitude",
            "unit": "m"
        },
        "time": {
            "label": "Time",
            "unit": "sec"
        },
        "pyro": {
            "label": "Pyro",
            "unit": ""
        },
        "state": {
            "label": "State",
            "unit": ""
        }
    }
}];




let e_num = 0;
dataPoints = []
class DataPoint {
    constructor() {
        e_num += 1;
        this.divContainer = document.createElement("div");
        this.divContainer.className = "dpoint";
        this.label = document.createElement("label");
        this.label.textContent = "DATA " + e_num + ": ";
        this.divContainer.appendChild(this.label);

        this.selectButton = document.createElement("button");
        this.selectButton.id = "SELECTBUTTON" + e_num;
        this.selectButton.className = "selectButton";

        this.selectLabelSpan = document.createElement("span");
        this.selectLabelSpan.id = "select-label" + e_num;
        this.selectLabelSpan.textContent = "- please select one -";
        this.selectButton.appendChild(this.selectLabelSpan);

        this.arrowDiv = document.createElement("div");
        this.arrowDiv.id = "arrow" + e_num;
        this.arrowDiv.className = "arrow";
        this.selectButton.appendChild(this.arrowDiv);

        this.divContainer.appendChild(this.selectButton);

        this.dropdownDiv = document.createElement("div");
        this.dropdownDiv.className = "dropdown hidden";
        this.dropdownDiv.id = "dropdown" + e_num;

        this.options = Object.entries(Config[0].IncomingData).map(([key, value]) => {
            return { id: value.label.replace(/\s/g, "") + e_num, value: key, label: value.label };
        });

        this.options.forEach((option, index) => {
            const input = document.createElement("input");
            input.type = "radio";
            input.id = option.id;
            input.name = "data" + e_num;
            input.value = option.value;
            input.className = "option";

            const optionLabel = document.createElement("label");
            optionLabel.setAttribute("for", option.id);
            optionLabel.className = "select-item";
            optionLabel.textContent = option.label;

            this.dropdownDiv.appendChild(input);
            this.dropdownDiv.appendChild(optionLabel);
        });

        this.divContainer.appendChild(this.dropdownDiv);

        const dataContainer = document.getElementById("DATACONTAINER");
        dataContainer.appendChild(this.divContainer);

        const selectButtons = document.querySelectorAll('.selectButton');
        const dropdowns = document.querySelectorAll('.dropdown');

        document.addEventListener('click', function(e) {
            let isClickInsideDropdown = false;

            dropdowns.forEach(dropdown => {
                if (dropdown.contains(e.target)) {
                    isClickInsideDropdown = true;
                }
            });

            const isClickInsideSelectButton = Array.from(selectButtons).some(button => button.contains(e.target));

            if (!isClickInsideDropdown && !isClickInsideSelectButton) {
                dropdowns.forEach(dropdown => {
                    if (!dropdown.classList.contains('hidden')) {
                        dropdown.classList.add('hidden');
                    }
                });
            }
        });

        this.selectButton.addEventListener("click", (e) => {
            e.preventDefault();
            this.toggleHidden();
        });

        this.options.forEach((option) => {
            const optionInput = document.getElementById(option.id);
            optionInput.addEventListener("click", (e) => {
                this.setSelectTitle(e);
            });
        });
    }

    toggleHidden() {
        this.dropdownDiv.classList.toggle("hidden");
    }

    setSelectTitle(e) {
        const selectedValue = e.target.value;
        const labelElement = document.querySelector(`label[for="${e.target.id}"]`).innerText;
        this.selectLabelSpan.innerText = labelElement;
        this.toggleHidden();


    }
}


function createDataPoints() {
    const numberOfData = parseInt(document.getElementById('numberOfData').value);

    // Remove any excess data points
    while (dataPoints.length > numberOfData) {
        const dataPoint = dataPoints.pop();
        dataPoint.divContainer.remove();
        e_num = numberOfData;
    }

    // Create additional data points if needed
    while (dataPoints.length < numberOfData) {
        const dataPoint = new DataPoint();
        dataPoints.push(dataPoint);
    }
}


// FOR CHART
let c_num = 0
let chartPoints = []
class ChartPoint {
    constructor() {
        c_num += 1;
        let chartid = "chart" + c_num
        this.divContainer = document.createElement("div");
        this.divContainer.className = "dpoint";

        this.label = document.createElement("label");
        this.label.textContent = "CHART " + c_num + ": ";
        this.divContainer.appendChild(this.label);

        this.selectButton = document.createElement("button");
        this.selectButton.id = "SELECTBUTTON" + chartid;
        this.selectButton.className = "selectButton";

        this.selectLabelSpan = document.createElement("span");
        this.selectLabelSpan.id = "select-label" + chartid;
        this.selectLabelSpan.textContent = "- please select one -";
        this.selectButton.appendChild(this.selectLabelSpan);

        this.arrowDiv = document.createElement("div");
        this.arrowDiv.id = "arrow" + chartid;
        this.arrowDiv.className = "arrow";
        this.selectButton.appendChild(this.arrowDiv);

        this.divContainer.appendChild(this.selectButton);

        this.dropdownDiv = document.createElement("div");
        this.dropdownDiv.className = "dropdown hidden";
        this.dropdownDiv.id = "dropdown" + chartid;

        this.options = Object.entries(Config[0].IncomingData)
            .filter(([key, value]) => value.hasOwnProperty('unit'))
            .map(([key, value]) => ({
                id: value.label.replace(/\s/g, "") + chartid,
                value: key,
                label: value.label
            }));

        this.options.forEach((option, index) => {
            const input = document.createElement("input");
            input.type = "radio";
            input.id = option.id;
            input.name = chartid;
            input.value = option.value;
            input.className = "option";

            const optionLabel = document.createElement("label");
            optionLabel.setAttribute("for", option.id);
            optionLabel.className = "select-item";
            optionLabel.textContent = option.label;

            this.dropdownDiv.appendChild(input);
            this.dropdownDiv.appendChild(optionLabel);
        });

        this.divContainer.appendChild(this.dropdownDiv);

        const dataContainer = document.getElementById("CHARTCONTAINER");
        dataContainer.appendChild(this.divContainer);

        const selectButtons = document.querySelectorAll('.selectButton');
        const dropdowns = document.querySelectorAll('.dropdown');

        document.addEventListener('click', function(e) {
            let isClickInsideDropdown = false;

            dropdowns.forEach(dropdown => {
                if (dropdown.contains(e.target)) {
                    isClickInsideDropdown = true;
                }
            });

            const isClickInsideSelectButton = Array.from(selectButtons).some(button => button.contains(e.target));

            if (!isClickInsideDropdown && !isClickInsideSelectButton) {
                dropdowns.forEach(dropdown => {
                    if (!dropdown.classList.contains('hidden')) {
                        dropdown.classList.add('hidden');
                    }
                });
            }
        });

        this.selectButton.addEventListener("click", (e) => {
            e.preventDefault();
            this.toggleHidden();
        });

        this.options.forEach((option) => {
            const optionInput = document.getElementById(option.id);
            optionInput.addEventListener("click", (e) => {
                this.setSelectTitle(e);
            });
        });
    }

    toggleHidden() {
        this.dropdownDiv.classList.toggle("hidden");
    }

    setSelectTitle(e) {
        const selectedValue = e.target.value;
        const labelElement = document.querySelector(`label[for="${e.target.id}"]`).innerText;
        this.selectLabelSpan.innerText = labelElement;
        this.toggleHidden();

        // Disable selected option in other select buttons
    }
}
while (c_num < 4) {
    const chartPoint = new ChartPoint();
    chartPoints.push(chartPoint);
}