import React from 'react';

const ProcessTable = ({ processes, result }) => {
    return (
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
            return (
                <tr key={process.pid}>
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
