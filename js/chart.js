const canvas = document.getElementById('visualizationCanvas');
const ctx = canvas.getContext('2d');

let barStates = [];

function resetBarStates(dataset) {
    barStates = dataset.map(() => "normal");
}

function setBarStates(indices, visualState) {
    for (const index of indices) {
        if (index >= 0 && index < barStates.length) {
            barStates[index] = visualState;
        }
    }

    updateChart(state.data);
}

const glowPlugin = {
    id: "barGlow",

    afterDatasetsDraw(chart) {
        const ctx = chart.ctx;
        const meta = chart.getDatasetMeta(0);

        meta.data.forEach((bar, index) => {
            if (barStates[index] !== "found") {
                return;
            }

            ctx.save();

            ctx.shadowColor = "rgba(25, 135, 84, 1)";
            ctx.shadowBlur = 30;
            ctx.shadowOffsetX = 0;
            ctx.shadowOffsetY = 0;

            ctx.fillStyle = "rgba(25, 135, 84, 1)";

            ctx.fillRect(
                bar.x - bar.width / 2,
                bar.y,
                bar.width,
                bar.base - bar.y
            );

            ctx.restore();
        });
    }
};

const visualizerChart = new Chart(ctx, {
    type: 'bar',
    data: {
        labels: [],
        datasets: [{
            label: 'Data',
            data: [],
            backgroundColor: 'rgba(96, 165, 250, 0.85)',
            borderColor: 'rgb(96, 165, 250)',
            borderWidth: 2
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false
            }
        },
        scales: {
            x: {
                ticks: {
                    color: '#8b95a5'
                }
            },
            
            y: {
                beginAtZero: true,
                min: 0,
                grid: {
                    display: false
                }
            }
        }
    },

    plugins: [glowPlugin]
});

requestAnimationFrame(() => {
    requestAnimationFrame(() => {
        visualizerChart.resize();
    });
});

function updateChart(dataset) {
    const labelsCollection = dataset.map((_, index) => `Point ${index}`);

    const maxValue = Math.max(...dataset);
    const dynamicScale = Math.ceil(maxValue * 1.1);

    if(barStates.length !== dataset.length) {
         barStates = dataset.map(() => "normal");
    }

    const backgroundColors = barStates.map(barState => {
        switch (barState) {
            case "comparing":
                return "rgba(255, 193, 7, 0.85)";

            case "swapping":
                return "rgba(220, 53, 69, 0.85)";

            case "overwrite":
                return "rgba(13, 110, 253, 0.85)";

            case "sorted-all":
                return "rgba(96, 165, 250, 0.85) ";

            case "checked":
                return "rgba(108, 117, 125, 0.85)";

            case "found":
                return "rgba(25, 135, 84, 0.85)";

            default:
                return "rgba(96, 165, 250, 0.85)";
            }
    });

    const borderColors = barStates.map(barState => {
        switch (barState) {
            case "comparing":
                return "rgba(255, 193, 7, 0.85)";

            case "swapping":
                return "rgba(220, 53, 69, 0.85)";

            case "overwrite":
                return "rgba(13, 110, 253, 0.85)";

            case "sorted-all":
                return "rgba(96, 165, 250, 0.85)";

            case "checked":
                return "rgba(108, 117, 125, 0.85)";

            case "found":
                return "rgba(25, 135, 84, 0.85)";

            default:
                return "rgba(96, 165, 250, 0.85)";
            }
    });

    visualizerChart.data.labels = labelsCollection;
    visualizerChart.data.datasets[0].data = dataset;
    visualizerChart.data.datasets[0].backgroundColor = backgroundColors;
    visualizerChart.data.datasets[0].borderColor =  borderColors;
    visualizerChart.options.scales.y.max = dynamicScale;

    visualizerChart.update(
        document.body.classList.contains("reduce-motion")
            ? "none"
            : undefined
    );
}

function clearTemporaryBarStates() {
    for (let i = 0; i < barStates.length; i++) {
        if(barStates[i] === "comparing" || barStates[i] === "swapping" || barStates[i] === "overwrite") {
            barStates[i] = "normal";
        }
    }
}