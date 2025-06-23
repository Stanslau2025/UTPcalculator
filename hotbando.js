
// Default scale value (Updated to 2 for your expected calculation)
let scale = 12.2;

let G, R, DA, y, X, C; // Added C for footsteps

// This will store the results from previous calculations for Case 7
let previousResults = {
    G: null,
    R: null,
    DA: null,
    y: null,
    X: null,
    C: null, // Added C to store footsteps
    scale: scale
};

function showInputsForCalculation(calculationType) {
    // Hide all input groups
    const inputGroups = [
        "y-input-group",
        "da-input-group",
        "g-input-group",
        "r-input-group",
        "x-input-group",
        "c-input-group",
        "scale-input-group"
    ];
    inputGroups.forEach(group => {
        document.getElementById(group).style.display = "none";
    });

    // Show relevant input groups based on calculation type
    switch (calculationType) {
        case "1": // Relationship of Measurements
            ["y-input-group", "da-input-group", "g-input-group", "r-input-group"].forEach(group => {
                document.getElementById(group).style.display = "block";
            });
            break;

        case "2": // Real Distance of UTP Cable
        case "3": // Number of Human Footsteps
            ["da-input-group", "g-input-group", "r-input-group"].forEach(group => {
                document.getElementById(group).style.display = "block";
            });
            break;

        case "4": // UTP Cable Distance on Phone Screen Scale
            ["da-input-group", "r-input-group", "x-input-group"].forEach(group => {
                document.getElementById(group).style.display = "block";
            });
            break;

        case "5": // Real Distance Between Source and Access Point
            ["y-input-group", "g-input-group", "r-input-group"].forEach(group => {
                document.getElementById(group).style.display = "block";
            });
            break;

        case "6": // Change Phone Scale
            document.getElementById("scale-input-group").style.display = "block";
            break;

        case "7": // Convert Footsteps into Meters and Pixels (moved from Case 8)
            document.getElementById("c-input-group").style.display = "block"; // Show the C input field
            break;

        case "8": // Arranged Data of Previous Calculations (moved from Case 7)
            break;
    }
}

document.getElementById("relation").addEventListener("change", function () {
    const selectedValue = this.value;
    showInputsForCalculation(selectedValue);
});

document.getElementById("calculate-btn").addEventListener("click", function () {
    const relation = document.getElementById("relation").value;

    let y = parseFloat(document.getElementById("y-input").value);
    let DA = parseFloat(document.getElementById("da-input").value);
    let G = parseFloat(document.getElementById("g-input").value);
    let R = parseFloat(document.getElementById("r-input").value);
    let X = parseFloat(document.getElementById("x-input")?.value);
    let C = parseFloat(document.getElementById("c-input")?.value); // Added input for C
    let manualScale = parseFloat(document.getElementById("scale-input")?.value);
    let result;

    // Ensure all calculations are consistent with the scale
    switch (relation) {
        case "1": // Relationship of Measurements
            if (isNaN(y)) { 
                y = (DA * G) / R;
                result = `y = ${y.toFixed(2)} meters`;
            } else if (isNaN(DA)) { 
                DA = (R * y) / G;
                result = `DA = ${DA.toFixed(2)} meters`;
            } else if (isNaN(G)) { 
                G = (R * y) / DA;
                result = `G = ${G.toFixed(2)} px`;
            } else if (isNaN(R)) { 
                R = (DA * G) / y;
                result = `R = ${R.toFixed(2)} px`;
            } else {
                result = "Please leave one value empty to calculate.";
            }
            break;

        case "2": // Real Distance of UTP Cable
            result = DA && G && R
                ? `y = ${(DA * G / R).toFixed(2)} meters`
                : "Please provide DA, G, and R values.";
            break;

        case "3": // Number of Human Footsteps
            result = DA && G && R
                ? `X = ${(DA * G / (0.8 * R)).toFixed(0)} steps`
                : "Please provide DA, G, and R values.";
            break;

        case "4": // UTP Cable Distance on Phone Screen Scale
            result = DA && R && X
                ? `G = ${(0.8 * R * X / DA).toFixed(2)} px`
                : "Please provide DA, R, and X values.";
            break;

        case "5": // Real Distance Between Source and Access Point
            result = y && G && R
                ? `DA = ${(y * R / G).toFixed(2)} meters`
                : "Please provide y, G, and R values.";
            break;

        case "6": // Change Phone Scale
            if (!isNaN(manualScale) && manualScale > 0) {
                scale = manualScale;
                result = `Scale updated manually to ${scale}`;
            } else {
                result = `Using the current scale: ${scale}`;
            }
            break;

        case "7": // Convert Footsteps into Meters and Pixels
    if (!isNaN(C)) {
        let respectiveDistanceMeters = C * 0.8;
        let respectiveDistancePixels = respectiveDistanceMeters * scale;

        // Generate results with editable fields
        result = `
            <div class="result-item">
                <label>Input:</label> 
                <span class="editable-value" contenteditable="true" data-key="C">${C.toFixed(2)}</span> footsteps
            </div>
            <div class="result-item">
                <label>(Meters):</label> 
                <span class="editable-value" contenteditable="true" data-key="meters">${respectiveDistanceMeters.toFixed(2)}</span> m
            </div>
            <div class="result-item">
                <label>(Pixels):</label> 
                <span class="editable-value" contenteditable="true" data-key="pixels">${respectiveDistancePixels.toFixed(2)}</span> px
            </div>
        `;

        // Add event listeners for editing
        setTimeout(() => {
            const editableFields = document.querySelectorAll(".editable-value");

            editableFields.forEach(field => {
                field.addEventListener("input", (e) => {
                    const key = field.getAttribute("data-key");
                    const rawValue = field.textContent.trim();
                    const newValue = parseFloat(rawValue);

                    if (!isNaN(newValue)) {
                        // Update related values dynamically
                        if (key === "C") {
                            C = newValue;
                            respectiveDistanceMeters = C * 0.8;
                            respectiveDistancePixels = respectiveDistanceMeters * scale;
                        } else if (key === "meters") {
                            respectiveDistanceMeters = newValue;
                            C = respectiveDistanceMeters / 0.8;
                            respectiveDistancePixels = respectiveDistanceMeters * scale;
                        } else if (key === "pixels") {
                            respectiveDistancePixels = newValue;
                            respectiveDistanceMeters = respectiveDistancePixels / scale;
                            C = respectiveDistanceMeters / 0.8;
                        }

                        // Dynamically update all fields
                        document.querySelector("[data-key='C']").textContent = C.toFixed(2);
                        document.querySelector("[data-key='meters']").textContent = respectiveDistanceMeters.toFixed(2);
                        document.querySelector("[data-key='pixels']").textContent = respectiveDistancePixels.toFixed(2);
                    }
                });

                field.addEventListener("focus", (e) => {
                    // Clear formatting (e.g., 0.00) for easier editing
                    const rawValue = field.textContent.trim();
                    if (parseFloat(rawValue) === 0 || rawValue === "0.00") {
                        field.textContent = "";
                    }
                });

                field.addEventListener("blur", (e) => {
                    // Reset to 0.00 if left empty or invalid
                    const rawValue = field.textContent.trim();
                    const newValue = parseFloat(rawValue);

                    if (rawValue === "" || isNaN(newValue)) {
                        field.textContent = "0.00";
                    } else {
                        // Format valid numbers
                        field.textContent = newValue.toFixed(2);
                    }
                });
            });
        }, 0);
    } else {
        result = "Please enter a valid number of footsteps (C).";
    }
    break;
    
    
        case "8": // Arranged Data of Previous Calculations (was Case 7)
            result = `
                <div class="result-item"><strong>R:</strong> ${previousResults.R?.toFixed(2)} px</div>
                <div class="result-item"><strong>G:</strong> ${previousResults.G?.toFixed(2)} px</div>
                <div class="result-item"><strong>DA:</strong> ${previousResults.DA?.toFixed(2)} meters</div>
                <div class="result-item"><strong>y:</strong> ${previousResults.y?.toFixed(2)} meters</div>
                <div class="result-item"><strong>X:</strong> ${previousResults.X?.toFixed(2)} steps</div>
                <div class="result-item"><strong>C:</strong> ${previousResults.C?.toFixed(2)} footsteps</div>
                <div class="result-item"><strong>Current Scale:</strong> ${scale} px/m</div>
            `;
            break;

        default:
            result = "Invalid calculation.";
    }

    if (relation !== "8") {
        previousResults = { G, R, DA, y, X, C, scale };
    }

    document.getElementById("result").innerHTML = result;
});

// Initialize the interface to show the correct input fields on page load
showInputsForCalculation("1");