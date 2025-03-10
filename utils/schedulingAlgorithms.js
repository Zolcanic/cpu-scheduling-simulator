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


export function* stcf(processes) {
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

        // Sort ready queue by remaining burst time (shortest first)
        readyQueue.sort((a, b) => {
            const remainingA = a.burstTime - (currentTime - a.arrivalTime);
            const remainingB = b.burstTime - (currentTime - b.arrivalTime);
            return remainingA - remainingB;
        });

        if (readyQueue.length > 0) {
            const process = readyQueue[0]; // Get the process with shortest remaining burst time

            // Decrement the burst time by 1 unit of time
            process.burstTime--;

            if (process.burstTime === 0) {
                // If the process is complete, calculate metrics and remove from ready queue
                const completionTime = currentTime + 1;
                const turnaroundTime = completionTime - process.arrivalTime;
                const waitingTime = turnaroundTime - process.burstTime;

                result.push({
                    pid: process.pid,
                    completionTime,
                    turnaroundTime,
                    waitingTime,
                });

                readyQueue.shift();
            }

            currentTime++;

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


export function* rr(processes, timeQuantum) {
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

        if (readyQueue.length > 0) {
            const process = readyQueue.shift(); // Dequeue the first process

            // Execute the process for the time quantum or its remaining burst time, whichever is smaller
            const executionTime = Math.min(process.burstTime, timeQuantum);
            process.burstTime -= executionTime;
            currentTime += executionTime;

            if (process.burstTime === 0) {
                // If the process is complete, calculate metrics
                const completionTime = currentTime;
                const turnaroundTime = completionTime - process.arrivalTime;
                const waitingTime = turnaroundTime - process.burstTime;

                result.push({
                    pid: process.pid,
                    completionTime,
                    turnaroundTime,
                    waitingTime,
                });
            } else {
                // If the process is not complete, add it back to the ready queue
                readyQueue.push(process);
            }

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
