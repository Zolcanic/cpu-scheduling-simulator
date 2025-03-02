import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

const ChartDisplay = ({ result, algorithm, running, currentTime }) => {
    const chartRef = useRef(null);
    const chartInstance = useRef(null);

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
                            backgroundColor: 'rgba(54, 162, 235, 0.5)',
                                              borderColor: 'rgba(54, 162, 235, 1)',
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
    }, [result, algorithm, running, currentTime]);

    return <canvas ref={chartRef} />;
};

export default ChartDisplay;
