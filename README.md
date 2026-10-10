# Algorithm Visualizer

An interactive, browser-based tool for visualizing sorting and searching algorithms using JavaScript and Chart.js.

## Overview

Algorithm Visualizer helps users understand how common algorithms operate on datasets through animated bar-chart visualizations, execution controls, algorithm statistics, and complexity information.

The project is built with HTML, CSS, and vanilla JavaScript, with Chart.js powering the chart visualization.

## Features

### Algorithms
- **Sorting:** Bubble Sort, Insertion Sort, Selection Sort, Merge Sort, Quick Sort, and Heap Sort.
- **Searching:** Linear Search and Binary Search.

### Dataset Management
- Enter custom datasets.
- Generate random dataset values.
- Adjust dataset size using a slider.
- Synchronize dataset values with the selected size.
- Update the chart when the dataset changes.

### Execution Controls
- Start, pause, step through, and reset algorithm execution.
- Adjust playback speed.
- Display execution status and event history.
- Validate inputs before running algorithms.

### Visualization and Analysis
- Visualize dataset values using bar charts.
- Track algorithm-specific statistics.
- Display time and space complexity information.
- Highlight visualization states during execution.

### Settings and Accounts
- Customize supported visual settings, including theme and reduced motion.
- Configure default playback speed and dataset size.
- Create an account and log in.
- View, export, or manage locally stored account and application data, where implemented.

## Technologies Used

- **HTML5** — application structure
- **CSS3** — layout, styling, and responsive interface
- **JavaScript (ES6+)** — algorithms, application state, event handling, and validation
- **Chart.js** — chart rendering
- **Chart.js Annotation Plugin** — chart annotations, where used
- **Web Storage API** — local persistence

## Getting Started

### Prerequisites

- A modern web browser algorithm tool
- An internet connection to load the Chart.js libraries from their CDN

### Installation

1. Clone or download this repository.
2. Open the project folder in your code editor.
3. Run the application using a local development server, or open the HTML entry point if the project supports direct file access.
4. Use the algorithm selector to choose a sorting or searching algorithm.
5. Enter a dataset and configure the execution controls.
6. Press **Start** to begin visualization.

## How to Use

1. Select an algorithm.
2. Enter a comma-separated dataset or generate random values.
3. Set the dataset size and playback speed.
4. For searching algorithms, enter a target value.
5. Start the execution and use Pause, Step, or Reset as needed.
6. Review the chart, statistics, execution status, and complexity information.

**Note:** Binary Search requires a dataset sorted in ascending order. Search targets are only relevant to searching algorithms.

## Project Structure

The project is organized into HTML, CSS, and JavaScript files. The JavaScript is separated by their responsibilities.

```text
Algorithm-Visualizer/
├── index.html
├── css/
│   └── style.css
└── js/
    ├── chart.js
    ├── algorithm.js
    ├── mainUI.js
    ├── settings.js
    └── accounts.js
```

*Adjust the filenames and folder structure to match the actual repository.*

## Complexity Reference

| Algorithm | Average Time Complexity | Space Complexity |
|---|---:|---:|
| Bubble Sort | O(n²) | O(1) |
| Insertion Sort | O(n²) | O(1) |
| Selection Sort | O(n²) | O(1) |
| Merge Sort | O(n log n) | O(n) |
| Quick Sort | O(n log n) | O(log n) average auxiliary space |
| Heap Sort | O(n log n) | O(1) auxiliary space |
| Linear Search | O(n) | O(1) |
| Binary Search | O(log n) | O(1) |

*Complexities describe standard implementations; actual implementation details may affect space usage.*

## Data and Privacy

The application uses browser storage for local persistence. Data stored in the browser is associated with that browser profile and is not automatically synchronized across devices.

Do not use real or sensitive passwords with a demonstration authentication system unless secure password handling and a suitable backend have been implemented.

## Current Status

**Version:** 1.0 (initial release; update when published)

The project is focused on interactive algorithm visualization, input validation, execution controls, and algorithm analysis.

## Future Improvements

Potential future enhancements include graph traversal visualizations, pathfinding algorithms, and additional algorithm analysis tools.

## License

Add a license before distributing the project publicly. If no license is specified, others do not automatically receive permission to reuse, modify, or redistribute the code.

---

**Built as a learning project exploring algorithms, JavaScript, data visualization, and interactive UI development.**
[Edit in StackBlitz next generation editor ⚡️](https://stackblitz.com/~/github.com/nikinbrahma97-cs/stackblitz-starters-ps8fwzsk)
