// ========================================
// 1. DOM REFERENCES
// ========================================

const algorithmSelect = document.getElementById("algorithm");
const datasetInput = document.getElementById("dataset");

const speedInput = document.getElementById("speed");
const speedValue = document.getElementById("speedValue");

const sizeInput = document.getElementById("size");
const sizeValue = document.getElementById("sizeValue");

const target = document.getElementById("target");

const random = document.getElementById("randomBtn");

const barContainer = document.getElementById("bars");

const startBtn = document.getElementById("startBtn");
const pauseBtn = document.getElementById("pauseBtn");
const stepBtn = document.getElementById("stepBtn");
const resetBtn = document.getElementById("resetBtn");

const statusText = document.getElementById("statusText");
const executionStatus = document.getElementById("executionStatus");

const sortingStats = document.getElementById("sortingStats");
const searchStats = document.getElementById("searchStats");

const sortComparisonChecked = document.getElementById("comparisons");
const sortSwapChecked = document.getElementById("swaps");
const sortArrayAccessChecked = document.getElementById("accesses");
const sortStepsChecked = document.getElementById("steps");

const searchComparisonChecked = document.getElementById("searchComparisons");
const searchElementChecked = document.getElementById("checked");
const searchStepChecked = document.getElementById("searchSteps");

const algorithmName = document.getElementById('algorithmName');
const algorithmCategory = document.getElementById('algorithmCategory');
const algorithmDescription = document.getElementById('algorithmDescription');
const algorithmWorstTimeComplexity = document.getElementById('timeComplexity');
const algorithmAvgTimeComplexity = document.getElementById('complexityAverage');
const algorithmBestTimeComplexity = document.getElementById('complexityBest');
const algorithmSpaceComplexity = document.getElementById('spaceComplexity');


// ========================================
// 2. APPLICATION STATE
// ========================================

const state = {
    algorithm: algorithmSelect.value,

    originalData: [],
    data: [],

    generator: null,

    target: null,

    running: false,
    paused: false,

    step: 0,

    comparisons: 0,
    swaps: 0,
    accesses: 0,

    searchComparisons: 0,
    checked: 0,
    searchSteps: 0,

    timerId: null
};

const VISUALIZER_STATE_KEY = "algorithmVisualizerState";

// ========================================
// 3. DATA FUNCTIONS
// ========================================

function parseDataset() {
    const values = datasetInput.value;

    if (values === "") {
        throw new Error("Input Cannot Be Empty");
    }

    const valuesInArray = values.split(",");

    const numbers = valuesInArray.map(value => {
        return Number(value.trim());
    });

    return numbers;
}


function ValidateDataset() {
    const dataset = parseDataset();

    if (dataset.length === 0) {
        throw new Error("Invalid Dataset");
    }

    for (let data of dataset) {
        if (Number.isNaN(data)) {
            throw new Error("Invalid Dataset");
        }
    }

    return dataset;
}


// ========================================
// 4. VISUALIZATION FUNCTIONS
// ========================================



function resetStatistics() {
    state.step = 0;

    state.comparisons = 0;
    state.swaps = 0;
    state.accesses = 0;

    state.searchComparisons = 0;
    state.checked = 0;
    state.searchSteps = 0;

    sortComparisonChecked.textContent = 0;
    sortSwapChecked.textContent = 0;
    sortArrayAccessChecked.textContent = 0;
    sortStepsChecked.textContent = 0;

    searchComparisonChecked.textContent = 0;
    searchElementChecked.textContent = 0;
    searchStepChecked.textContent = 0;
}


function createGenerator() {
    const algorithm = algorithms[state.algorithm];

    if (!algorithm) {
        throw new Error("Algorithm Not Found");
    }
    if(algorithm.category === "searching") {
        state.target = Number(target.value);

        state.generator = algorithm.fn(state.data, state.target);
    }
    else {
        state.generator = algorithm.fn(state.data);
    }
}


function saveVisualizerState() {
    const visualizerState = {
        algorithm: state.algorithm,
        speed: Number(speedInput.value),
        datasetSize: Number(sizeInput.value),
        dataset: [...state.data]
    };

    localStorage.setItem(
        VISUALIZER_STATE_KEY,
        JSON.stringify(visualizerState)
    );
}


function loadVisualizerState() {
    const savedState = localStorage.getItem(VISUALIZER_STATE_KEY);

    if(!savedState) {
        return;
    }

    const visualizerState = JSON.parse(savedState);

    if(visualizerState.algorithm !== undefined) {
        algorithmSelect.value = visualizerState.algorithm;
        state.algorithm = visualizerState.algorithm;
    }

    if(visualizerState.speed !== undefined) {
        speedInput.value = visualizerState.speed;
        speedValue.textContent = `${visualizerState.speed}×`;
    }

    if (visualizerState.datasetSize !== undefined) {
        sizeInput.value = visualizerState.datasetSize;
        sizeValue.textContent = visualizerState.datasetSize;
    }

    if (Array.isArray(visualizerState.dataset)) {
        datasetInput.value = visualizerState.dataset.join(", ");
    }
}


function createVisualizer() {
    try {
        const dataset = ValidateDataset();

        state.originalData = [...dataset];
        state.data = [...dataset];

        resetStatistics();
        resetBarStates(state.data);

        createGenerator();

        updateChart(state.data);

        state.running = false;
        state.paused = false;

        executionStatus.textContent = "Ready";
    }
    catch (error) {
        console.log("Error:", error.message);
    }
}


// ========================================
// 5. EXECUTION ENGINE
// ========================================

function runStep() {
    if (!state.generator) {
        return;
    }

    const result = state.generator.next();

    if (result.done) {
        clearTemporaryBarStates();
        updateChart(state.data);
        return ;
    }

    handleVisualizationEvent(result.value);

    return "Continue";
}


// ========================================
// 6. EVENT PROCESSOR
// ========================================

function handleVisualizationEvent(event) {

    clearTemporaryBarStates()

    switch (event.type) {

        // ====================================
        // SORTING
        // ====================================

        case "compare":
            handleCompareEvent(event);
            break;

        case "swap":
            handleSwapEvent(event);
            break;

        case "overwrite":
            handleOverwriteEvent(event);
            break;

        case "sorted-all":
            handleSortedEvent();
            break;


        // ====================================
        // SEARCHING
        // ====================================

        case "checked":
            handleCheckedEvent(event);
            break;

        case "found":
            handleFoundEvent(event);
            break;

        case "not-found":
            handleNotFoundEvent();
            break;
        case "pass-complete":
            break;
    }
}


// ========================================
// 7. SORTING EVENT FUNCTIONS
// ========================================


function handleCompareEvent(event) {
    const [firstIndex, secondIndex] = event.indices;

    barStates.fill("normal");

    setBarStates(
        [firstIndex, secondIndex],
        "comparing"
    );

    state.comparisons++;
    state.step++;

    sortComparisonChecked.textContent = state.comparisons;
    sortStepsChecked.textContent = state.step;
}


function handleSwapEvent(event) {
    const [firstIndex, secondIndex] = event.indices;

    barStates.fill("normal");

    setBarStates(
        [firstIndex, secondIndex],
        "swapping"
    );

    state.swaps++;
    state.step++;
    state.accesses++;

    sortSwapChecked.textContent = state.swaps;
    sortStepsChecked.textContent = state.step;
    sortArrayAccessChecked.textContent = state.accesses;

    updateChart(state.data);
}


function handleOverwriteEvent(event) {
    const index = event.index;
    const value = event.value;

    state.data[index] = value;

    state.step++;
    state.accesses++;

    sortStepsChecked.textContent = state.step;
    sortArrayAccessChecked.textContent = state.accesses;

    barStates.fill("normal");
    barStates[index] = "swapping";

    updateChart(state.data);
}


function handleSortedEvent() {
    barStates.fill("sorted-all");

    updateChart(state.data);

    executionStatus.textContent = "Execution Completed";

    state.running = false;
    state.paused = false;
}


// ========================================
// 8. SEARCH EVENT FUNCTIONS
// ========================================

function handleCheckedEvent(event) {
    const index = event.index;

    if (index < 0 || index >= barStates.length) {
        return;
    }

    barStates[index] = "checked";

    state.checked++;
    state.searchComparisons++;
    state.searchSteps++;

    searchComparisonChecked.textContent = state.searchComparisons;
    searchElementChecked.textContent = state.checked;
    searchStepChecked.textContent = state.searchSteps;

    updateChart(state.data);
}


function handleFoundEvent(event) {
    const index = event.index;

    if (index < 0 || index >= barStates.length) {
        return;
    }

    barStates[index] = "found";

    updateChart(state.data);

    executionStatus.textContent = "Target Found";
    state.running = false;
    state.paused = false;
}


function handleNotFoundEvent() {
    executionStatus.textContent = "Target Not Found";

    state.running = false;
    state.paused = false;
}


// ========================================
// 9. EXECUTION SCHEDULER
// ========================================

function getStepDelay() {
    const speed = Number(speedInput.value);

    return 500 / speed;
}


function scheduleNextStep() {
    if (!state.running || state.paused) {
        return;
    }

    state.timerId = setTimeout(() => {

        state.timerId = null;

        if (!state.running || state.paused) {
            return;
        }

        const status = runStep();

        if (status === "Finished") {
            state.running = false;
            state.paused = false;
            executionStatus.textContent = "Ready";
            return;
        }

        scheduleNextStep();

    }, getStepDelay());
}


// ========================================
// 10. CONTROL FUNCTIONS
// ========================================

function startExecution() {
    if (state.running) {
        return;
    }

    const selectedAlgorithm = algorithm.value;

    const isSearchAlgorithm =  selectedAlgorithm === "linear" || selectedAlgorithm === "binary";

    if(!isSearchAlgorithm && target.value.trim() !== "") {
        executionStatus.textContent = "Warning: Clear the Target input before running a sorting algorithm.";
        return;
    }

    if(state.data.length === 0) {
        executionStatus.textContent = "Dataset cannot be empty.";
        return;
    }

    if((algorithm.value === "linear" || algorithm.value === "binary") && target.value.trim() === "") {
        executionStatus.textContent = "Search algorithms require a target value.";
        return;
    }


    if (algorithm.value === "binary" && !isSortedAscending(state.data)) {
        executionStatus.textContent = "Binary Search requires a sorted dataset.";
        return;
    }

    if (!state.generator) {
        createGenerator();
    }

    state.running = true;
    state.paused = false;

    executionStatus.textContent = "Running";

    scheduleNextStep();
}


function pauseExecution() {
    state.paused = true;
    state.running = false;

    if (state.timerId !== null) {
        clearTimeout(state.timerId);
        state.timerId = null;
    }

    executionStatus.textContent = "Paused";
}


function executeSingleStep() {
    if (state.running) {
        return;
    }

    if (!state.generator) {
        createGenerator();
    }

    state.paused = true;

    const status = runStep();

    if (status === "Finished") {
        state.running = false;
        state.paused = false;
    }
}


function resetExecution() {
    if (state.timerId !== null) {
        clearTimeout(state.timerId);
        state.timerId = null;
    }

    state.running = false;
    state.paused = false;

    state.data = [...state.originalData];

    resetStatistics();
    resetBarStates(state.data);

    createGenerator();

    updateChart(state.data);

    executionStatus.textContent = "Ready";
}


function updateSpeedDisplay() {
    speedValue.textContent = `${speedInput.value}×`;
}


// ========================================
// 11. INPUT FUNCTIONS
// ========================================

function handleSizeChange() {
    sizeValue.textContent = sizeInput.value;

    try {
        const selectedSize = Number(sizeInput.value);
        let dataset;

        if (datasetInput.value.trim() === "") {
            dataset = [];
        } 

        else {
             dataset = ValidateDataset();
        }

        if (dataset.length > selectedSize) {
            dataset = dataset.slice(0, selectedSize);
        }

        else if (dataset.length < selectedSize) {
            const missingSize = selectedSize - dataset.length;

            for (let i = 0; i < missingSize; i++) {
                const randomValue = Math.floor(Math.random() * 100) + 1;

                dataset.push(randomValue);
            }
        }

        state.originalData = [...dataset];
        state.data = [...dataset];

        datasetInput.value = state.data.join(", ");

        state.generator = null;

        resetStatistics();

        updateChart(state.data);

        saveVisualizerState();
    }
    catch (error) {
        console.log("Error:", error.message);
    }
}


function handleDatasetChange() {
    try {
        if (datasetInput.value.trim() === "") {
            state.originalData = [];
            state.data = [];

            state.generator = null;

            resetStatistics();

            updateChart([]);

            saveVisualizerState();

            return;
        }
        
        const dataset = ValidateDataset();

        state.originalData = [...dataset];
        state.data = [...dataset];

        sizeInput.value = state.data.length;
        sizeValue.textContent = state.data.length;

        state.generator = null;

        resetStatistics();

        updateChart(state.data);

        saveVisualizerState();
    }
    catch (error) {
        console.log("Error:", error.message);
    }
}


function handleAlgorithmChange() {
    state.algorithm = algorithmSelect.value;

    state.running = false;
    state.paused = false;

    if (state.timerId !== null) {
        clearTimeout(state.timerId);
        state.timerId = null;
    }

    state.data = [...state.originalData];

    resetStatistics();

    createGenerator();


    updateChart(state.data);

    updateAlgorithmComplexity();

    saveVisualizerState();

    executionStatus.textContent = "Ready";
}

function randomizeDatasetValues() {
    try {
        if(!Array.isArray(state.data) || state.data.length === 0) {
            throw new Error("Invalid Dataset");
        }

        if (state.timerId !== null) {
            clearTimeout(state.timerId);
            state.timerId = null;
        }

        state.running = false;
        state.paused = false;

        for(let i = 0; i < state.data.length; i++) {
            state.data[i] = Math.floor(Math.random() * 100) + 1;
        }

        datasetInput.value = state.data.join(", ");

        state.originalData = [...state.data];
        state.generator = null;

        resetStatistics();

        updateChart(state.data);

        saveVisualizerState();

        executionStatus.textContent = "Ready";
    }
    catch(error) {
        console.log("Error:", error.message);
    }
}

function updateAlgorithmComplexity() {
    const algorithm = algorithms[state.algorithm];

    if(!algorithm) {
        return;
    }

    algorithmName.textContent = algorithm.label;
    algorithmCategory.textContent = algorithm.category;
    algorithmDescription.textContent = algorithm.description;
    algorithmBestTimeComplexity.textContent = algorithm.bestTime;
    algorithmAvgTimeComplexity.textContent = algorithm.avgTime;
    algorithmWorstTimeComplexity.textContent = algorithm.worstTime;
    algorithmSpaceComplexity.textContent  = algorithm.space;
}

function isSortedAscending(array) {
    for (let i = 1; i < array.length; i++) {
        if (array[i] < array[i - 1]) {
            return false;
        }
    }

    return true;
}


// ========================================
// 12. EVENT LISTENERS
// ========================================

speedInput.addEventListener("input", updateSpeedDisplay);

sizeInput.addEventListener("input", handleSizeChange);

datasetInput.addEventListener("input", handleDatasetChange);

target.addEventListener("input", () => {
    state.generator = null;
});

random.addEventListener("click", randomizeDatasetValues);

algorithmSelect.addEventListener("change", handleAlgorithmChange);

startBtn.addEventListener("click", startExecution);

pauseBtn.addEventListener("click", pauseExecution);

stepBtn.addEventListener("click", executeSingleStep);

resetBtn.addEventListener("click", resetExecution);


// ========================================
// 13. INITIALIZATION
// ========================================

createVisualizer();

updateSpeedDisplay();