//Settings Control
const Settings = document.getElementById("SETTINGS");

function settings() {
    Settings.style.display = "flex";
    card.style.display = "flex";
    document.body.style.overflow = "hidden";
    document.getElementById("ComPort").value = comport;
    document.getElementById("numberOfAData").value = numAdata;
    document.getElementById("numberOfDData").value = numDdata;
    document.getElementById("SampleRate").value = samplerate;
    createADataPoints();
    createDDataPoints();
    for (const key in AdataID[0]) {
        document.getElementById(AdataID[0][key]).click();
    }
    for (const key in DdataID[0]) {
        document.getElementById(DdataID[0][key]).click();
    }
    for (const key in chartID[0]) {
        document.getElementById(chartID[0][key]).click();
    }
}

function closeCard() {
    const card = document.getElementById("card");
    Settings.style.display = "none";
    card.style.display = "none";
    document.body.style.overflow = "auto"; // Restore scrollbars when the card is closed
}

var Config = [{
    IncomingData: {
        accx: {
            label: "Acceleration X",
            unit: "m/sec2",
            calib: 1
        },
        accy: {
            label: "Acceleration Y",
            unit: "m/sec2",
            calib: 1
        },
        accz: {
            label: "Acceleration Z",
            unit: "m/sec2",
            calib: 1
        },
        gyrox: {
            label: "GYRO X",
            unit: " deg",
            calib: 1
        },
        gyroy: {
            label: "GYRO Y",
            unit: " deg",
            calib: 1
        },
        gyroz: {
            label: "GYRO Z",
            unit: " deg",
            calib: 0
        },
        temp: {
            label: "Temperature",
            unit: " deg",
            calib: 1
        },
        lat_deg: {
            label: "Latitude Degree",
            unit: " ",
            calib: 0
        },
        lat_min: {
            label: "Latitude Minute",
            unit: " ",
            calib: 0
        },
        lat_sec: {
            label: "Latitude Second",
            unit: " ",
            calib: 0
        },
        lat_hem: {
            label: "Latitude Hemisphere",
            unit: " ",
            calib: 0
        },
        long_deg: {
            label: "Longitude Degree",
            unit: " ",
            calib: 0
        },
        long_min: {
            label: "Longitude Minute",
            unit: " ",
            calib: 0
        },
        long_sec: {
            label: "Longitude Second",
            unit: " ",
            calib: 0
        },
        long_hem: {
            label: "Longitude Hemisphere",
            unit: " ",
            calib: 0
        },
        vel: {
            label: "Velocity",
            unit: " deg",
            calib: 0
        },
        alt: {
            label: "Altitude",
            unit: "m",
            calib: 1
        },
        time: {
            label: "Time",
            unit: "sec",
            calib: 0
        },
        pyro: {
            label: "Pyro",
            unit: "",
            calib: 0
        },
        state: {
            label: "State",
            unit: "",
            calib: 0
        },
    },
}, ];

let e_num = 0;
dataPoints = [];
class DataPoint {
    constructor() {
        e_num += 1;
        this.divContainer = document.createElement("div");
        this.divContainer.className = "dpoint";

        this.selectButton = document.createElement("button");
        this.selectButton.id = "SELECTBUTTON" + e_num;
        this.selectButton.className = "selectButton";

        this.selectLabelSpan = document.createElement("span");
        this.selectLabelSpan.id = "select-label" + e_num;
        this.selectLabelSpan.textContent = "- please select one - DATA " + e_num + " :";
        this.selectButton.appendChild(this.selectLabelSpan);

        this.arrowDiv = document.createElement("div");
        this.arrowDiv.id = "arrow" + e_num;
        this.arrowDiv.className = "arrow";
        this.selectButton.appendChild(this.arrowDiv);

        this.divContainer.appendChild(this.selectButton);

        this.dropdownDiv = document.createElement("div");
        this.dropdownDiv.className = "dropdown hidden";
        this.dropdownDiv.id = "dropdown" + e_num;

        this.options = Object.entries(Config[0].IncomingData).map(
            ([key, value]) => {
                return {
                    id: value.label.replace(/\s/g, "") + e_num,
                    value: key,
                    label: value.label,
                };
            }
        );

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

        const dataContainer = document.getElementById("ADATACONTAINER");
        dataContainer.appendChild(this.divContainer);

        const selectButtons = document.querySelectorAll(".selectButton");
        const dropdowns = document.querySelectorAll(".dropdown");

        document.addEventListener("click", function(e) {
            let isClickInsideDropdown = false;

            dropdowns.forEach((dropdown) => {
                if (dropdown.contains(e.target)) {
                    isClickInsideDropdown = true;
                }
            });

            const isClickInsideSelectButton = Array.from(selectButtons).some(
                (button) => button.contains(e.target)
            );

            if (!isClickInsideDropdown && !isClickInsideSelectButton) {
                dropdowns.forEach((dropdown) => {
                    if (!dropdown.classList.contains("hidden")) {
                        dropdown.classList.add("hidden");
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
        const labelElement = document.querySelector(
            `label[for="${e.target.id}"]`
        ).innerText;
        this.selectLabelSpan.innerText = labelElement;
        this.toggleHidden();
    }
}

function createADataPoints() {
    const numberOfAData = parseInt(document.getElementById("numberOfAData").value);

    // Remove any excess data points
    while (dataPoints.length > numberOfAData) {
        const dataPoint = dataPoints.pop();
        dataPoint.divContainer.remove();
        e_num = numberOfAData;
    }

    // Create additional data points if needed
    while (dataPoints.length < numberOfAData) {
        const dataPoint = new DataPoint();
        dataPoints.push(dataPoint);
    }
}
// For DESCENT

let d_num = 0;
DdataPoints = [];
class DDataPoint {
    constructor() {
        d_num += 1;
        let tag = d_num + "tag"
        this.divContainer = document.createElement("div");
        this.divContainer.className = "dpoint";

        this.selectButton = document.createElement("button");
        this.selectButton.id = "SELECTBUTTON" + tag;
        this.selectButton.className = "selectButton";

        this.selectLabelSpan = document.createElement("span");
        this.selectLabelSpan.id = "select-label" + tag;
        this.selectLabelSpan.textContent = "- please select one - DATA " + d_num + " :";
        this.selectButton.appendChild(this.selectLabelSpan);

        this.arrowDiv = document.createElement("div");
        this.arrowDiv.id = "arrow" + tag;
        this.arrowDiv.className = "arrow";
        this.selectButton.appendChild(this.arrowDiv);

        this.divContainer.appendChild(this.selectButton);

        this.dropdownDiv = document.createElement("div");
        this.dropdownDiv.className = "dropdown hidden";
        this.dropdownDiv.id = "dropdown" + tag;

        this.options = Object.entries(Config[0].IncomingData).map(
            ([key, value]) => {
                return {
                    id: value.label.replace(/\s/g, "") + tag,
                    value: key,
                    label: value.label,
                };
            }
        );

        this.options.forEach((option, index) => {
            const input = document.createElement("input");
            input.type = "radio";
            input.id = option.id;
            input.name = "data" + tag;
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

        const dataContainer = document.getElementById("DDATACONTAINER");
        dataContainer.appendChild(this.divContainer);

        const selectButtons = document.querySelectorAll(".selectButton");
        const dropdowns = document.querySelectorAll(".dropdown");

        document.addEventListener("click", function(e) {
            let isClickInsideDropdown = false;

            dropdowns.forEach((dropdown) => {
                if (dropdown.contains(e.target)) {
                    isClickInsideDropdown = true;
                }
            });

            const isClickInsideSelectButton = Array.from(selectButtons).some(
                (button) => button.contains(e.target)
            );

            if (!isClickInsideDropdown && !isClickInsideSelectButton) {
                dropdowns.forEach((dropdown) => {
                    if (!dropdown.classList.contains("hidden")) {
                        dropdown.classList.add("hidden");
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
        const labelElement = document.querySelector(
            `label[for="${e.target.id}"]`
        ).innerText;
        this.selectLabelSpan.innerText = labelElement;
        this.toggleHidden();
    }
}

function createDDataPoints() {
    const numberOfDData = parseInt(document.getElementById("numberOfDData").value);

    // Remove any excess data points
    while (DdataPoints.length > numberOfDData) {
        const dataPoint = DdataPoints.pop();
        dataPoint.divContainer.remove();
        d_num = numberOfDData;
    }

    // Create additional data points if needed
    while (DdataPoints.length < numberOfDData) {
        const dataPoint = new DDataPoint();
        DdataPoints.push(dataPoint);
    }
}


// FOR CHART
let c_num = 0;
let chartPoints = [];
class ChartPoint {
    constructor() {
        c_num += 1;
        let chartid = "chart" + c_num;
        this.divContainer = document.createElement("div");
        this.divContainer.className = "dpoint";

        this.selectButton = document.createElement("button");
        this.selectButton.id = "SELECTBUTTON" + chartid;
        this.selectButton.className = "selectButton";

        this.selectLabelSpan = document.createElement("span");
        this.selectLabelSpan.id = "select-label" + chartid;
        this.selectLabelSpan.textContent = "- please select one - CHART " + c_num + " :";
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
            .filter(([key, value]) => value.hasOwnProperty("unit"))
            .map(([key, value]) => ({
                id: value.label.replace(/\s/g, "") + chartid,
                value: key,
                label: value.label,
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

        const selectButtons = document.querySelectorAll(".selectButton");
        const dropdowns = document.querySelectorAll(".dropdown");

        document.addEventListener("click", function(e) {
            let isClickInsideDropdown = false;

            dropdowns.forEach((dropdown) => {
                if (dropdown.contains(e.target)) {
                    isClickInsideDropdown = true;
                }
            });

            const isClickInsideSelectButton = Array.from(selectButtons).some(
                (button) => button.contains(e.target)
            );

            if (!isClickInsideDropdown && !isClickInsideSelectButton) {
                dropdowns.forEach((dropdown) => {
                    if (!dropdown.classList.contains("hidden")) {
                        dropdown.classList.add("hidden");
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
        const labelElement = document.querySelector(
            `label[for="${e.target.id}"]`
        ).innerText;
        this.selectLabelSpan.innerText = labelElement;
        this.toggleHidden();

        // Disable selected option in other select buttons
    }
}
while (c_num < 4) {
    const chartPoint = new ChartPoint();
    chartPoints.push(chartPoint);
}