import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

const ChartDisplay = ({ result, algorithm, running, currentTime, processes }) => {
    const chartRef = useRef(null);
    const chartInstance = useRef(null);

    const colors = [
        '#e6194b', '#3cb44b', '#ffe119', '#0082c8', '#f58231',
        '#911eb4', '#46f0f0', '#f032e6', '#d2f53c', '#fabebe',
        '#008080', '#e6beff', '#aa6e28', '#fffac8', '#800000',
        '#aaffc3', '#808000', '#ffd8b1', '#000080', '#808080'
    ];

    const getProcessColor = (pid) => {
        const processIndex = processes.findIndex(p => p.pid === pid);
        if (processIndex !== -1) {
            return colors[processIndex % colors.length];
        }
        return '#ddd'; // Default color if process not found
    };

    useEffect(() => {
        if (chartInstance.current) {
            chartInstance.current.destroy();
        }

        if (result && result.length > 0) {
            const completionTimes = result.map((item) => item.completionTime);
            const labels = result.map((item) => `P${item.pid}`);

            const ctx = chartRef.current.getContext('2d');
            chartInstance.current = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: labels,
                    datasets: [
                        {
                            label: 'Completion Time',
                            data: completionTimes,
                            backgroundColor: result.map((item) => getProcessColor(item.pid)), // Dynamic colors
                                              borderColor: result.map((item) => getProcessColor(item.pid)), // Dynamic colors
                                              borderWidth: 1,
                        },
                    ],
                },
                options: {
                    animation: {
                        duration: running ? 1000 : 0, // Animate if running
                    },
                    scales: {
                        x: {
                            title: {
                                display: true,
                                text: 'Process ID',
                            },
                        },
                        y: {
                            title: {
                                display: true,
                                text: 'Completion Time',
                            },
                            max: currentTime ? currentTime + 5 : undefined, // Adjust max y-axis based on currentTime
                        },
                    },
                },
            });
        }
    }, [result, algorithm, running, currentTime, processes]); // Added processes to dependency array

    return <canvas ref={chartRef} />;
};

export default ChartDisplay;
