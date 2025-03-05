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

export function* sjf(processes) {
    const result = [];
    let currentTime = 0;
    const readyQueue = [];

    // Sort processes by arrival time
    const sortedProcesses = [...processes].sort((a, b) => a.arrivalTime - b.arrivalTime);

    let i = 0; // Index for sortedProcesses

    while (i < sortedProcesses.length || readyQueue.length > 0) {
        // Add processes that have arrived to the ready queue
        while (i < sortedProcesses.length && sortedProcesses[i].arrivalTime <= currentTime) {
            readyQueue.push(sortedProcesses[i]);
            i++;
        }

        // Sort ready queue by burst time (shortest first)
        readyQueue.sort((a, b) => a.burstTime - b.burstTime);

        if (readyQueue.length > 0) {
            const process = readyQueue.shift(); // Get the process with shortest burst time

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
        } else {
            // If no process is ready, increment currentTime
            currentTime++;
            yield { result: [...result], currentTime };
        }
    }

    // Final yield to signal completion
    yield { result: [...result], currentTime: null };
}

// ... other scheduling algorithms will be added here ...
