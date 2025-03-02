import React from 'react';

const ProcessTable = ({ processes, result, chartData }) => {
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

    const getTextColor = (backgroundColor) => {
        const hexToRgb = (hex) => {
            const r = parseInt(hex.slice(1, 3), 16),
            g = parseInt(hex.slice(3, 5), 16),
            b = parseInt(hex.slice(5, 7), 16);
            return { r, g, b };
        };

        const rgb = hexToRgb(backgroundColor);
        const luminance = (0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b) / 255;
        return luminance > 0.5 ? 'black' : 'white';
    };

    return (
        <div>
        <table style={{ borderCollapse: 'collapse', width: '100%' }}>
        <thead>
        <tr>
        <th style={tableHeaderStyle}>Process ID</th>
        <th style={tableHeaderStyle}>Arrival Time</th>
        <th style={tableHeaderStyle}>Burst Time</th>
        <th style={tableHeaderStyle}>Completion Time</th>
        <th style={tableHeaderStyle}>Turnaround Time</th>
        <th style={tableHeaderStyle}>Waiting Time</th>
        </tr>
        </thead>
        <tbody>
        {processes.map((process) => {
            const processResult = result.find((item) => item.pid === process.pid);
            const rowColor = getProcessColor(process.pid);
            return (
                <tr key={process.pid} style={{ backgroundColor: rowColor, color: getTextColor(rowColor) }}>
                <td style={tableCellStyle}>{process.pid}</td>
                <td style={tableCellStyle}>{process.arrivalTime}</td>
                <td style={tableCellStyle}>{process.burstTime}</td>
                <td style={tableCellStyle}>{processResult?.completionTime || '-'}</td>
                <td style={tableCellStyle}>{processResult?.turnaroundTime || '-'}</td>
                <td style={tableCellStyle}>{processResult?.waitingTime || '-'}</td>
                </tr>
            );
        })}
        </tbody>
        </table>


        <div style={{ marginTop: '20px' }}>
        {chartData && chartData.map((item) => (
            <div
            key={item.pid}
            style={{
                backgroundColor: getProcessColor(item.pid),
                                               width: `${item.duration * 20}px`, // Adjust width based on duration
                                               height: '30px',
                                               margin: '5px',
                                               display: 'inline-block',
            }}
            >
            {item.pid}
            </div>
        ))}
        </div>
        </div>
    );
};

const tableHeaderStyle = {
    border: '1px solid #ddd',
    padding: '8px',
    textAlign: 'left',
    backgroundColor: '#f2f2f2',
};

const tableCellStyle = {
    border: '1px solid #ddd',
    padding: '8px',
    textAlign: 'left',
};

export default ProcessTable;
