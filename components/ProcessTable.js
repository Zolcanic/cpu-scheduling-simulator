import React from 'react';

const ProcessTable = ({ processes, result }) => {
    return (
        <table>
        <thead>
        <tr>
        <th>Process ID</th>
        <th>Arrival Time</th>
        <th>Burst Time</th>
        <th>Completion Time</th>
        <th>Turnaround Time</th>
        <th>Waiting Time</th>
        </tr>
        </thead>
        <tbody>
        {processes.map((process) => {
            const processResult = result.find((item) => item.pid === process.pid);
            return (
                <tr key={process.pid}>
                <td>{process.pid}</td>
                <td>{process.arrivalTime}</td>
                <td>{process.burstTime}</td>
                <td>{processResult?.completionTime || '-'}</td>
                <td>{processResult?.turnaroundTime || '-'}</td>
                <td>{processResult?.waitingTime || '-'}</td>
                </tr>
            );
        })}
        </tbody>
        </table>
    );
};

export default ProcessTable;
