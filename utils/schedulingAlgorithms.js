// utils/schedulingAlgorithms.js

export const fifo = (processes) => {
    const result = [];
    let currentTime = 0;

    // Sort processes by arrival time (just in case)
    const sortedProcesses = [...processes].sort((a, b) => a.arrivalTime - b.arrivalTime);

    for (const process of sortedProcesses) {
        // If the process arrives after the current time, update current time
        if (process.arrivalTime > currentTime) {
            currentTime = process.arrivalTime;
        }

        // Calculate completion time
        const completionTime = currentTime + process.burstTime;

        // Calculate turnaround time
        const turnaroundTime = completionTime - process.arrivalTime;

        // Calculate waiting time
        const waitingTime = turnaroundTime - process.burstTime;

        // Add process result to the array
        result.push({
            pid: process.pid,
            completionTime: completionTime,
            turnaroundTime: turnaroundTime,
            waitingTime: waitingTime,
        });

        // Update current time
        currentTime = completionTime;
    }

    return result;
};

// ... other scheduling algorithms will be added here ...
