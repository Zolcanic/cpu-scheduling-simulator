// utils/schedulingAlgorithms.js

export function* fifo(processes) {
    const result = [];
    let currentTime = 0;

    const sortedProcesses = [...processes].sort((a, b) => a.arrivalTime - b.arrivalTime);

    for (const process of sortedProcesses) {
        if (process.arrivalTime > currentTime) {
            currentTime = process.arrivalTime;
        }

        const completionTime = currentTime + process.burstTime;
        const turnaroundTime = completionTime - process.arrivalTime;
        const waitingTime = turnaroundTime - process.burstTime;

        result.push({
            pid: process.pid,
            completionTime,
            turnaroundTime,
            waitingTime,
        });

        currentTime = completionTime;

        // Yield intermediate results
        yield { result: [...result], currentTime };
    }

    // Final yield to signal completion
    yield { result: [...result], currentTime: null };
}

// ... other scheduling algorithms will be added here ...
