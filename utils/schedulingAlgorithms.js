// utils/schedulingAlgorithms.js

// First In First Out (FIFO) Scheduling Algorithm
export function* fifo(processes) {
    const result = [];
    let currentTime = 0;

    // Sort processes by arrival time
    const sortedProcesses = [...processes].sort((a, b) => a.arrivalTime - b.arrivalTime);

    // Iterate through each process in the sorted array
    for (const process of sortedProcesses) {
        // If the CPU is idle, move time forward to the next arrival
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

        yield { result: [...result], currentTime };
    }

    yield { result: [...result], currentTime: null };
}

// Shortest Job First (SJF) Non-preemptive Scheduling Algorithm
export function* sjf(processes) {
    const result = [];
    let currentTime = 0;
    const readyQueue = [];

    const sortedProcesses = [...processes].sort((a, b) => a.arrivalTime - b.arrivalTime);

    let i = 0;

    // Continue while there are processes to arrive or in the ready queue
    while (i < sortedProcesses.length || readyQueue.length > 0) {
        // Add all processes that have arrived by currentTime to the ready queue
        while (i < sortedProcesses.length && sortedProcesses[i].arrivalTime <= currentTime) {
            readyQueue.push(sortedProcesses[i]);
            i++;
        }

        if (readyQueue.length > 0) {
            // Sort ready queue by burst time (shortest job first)
            readyQueue.sort((a, b) => a.burstTime - b.burstTime);

            const process = readyQueue.shift();
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

            yield { result: [...result], currentTime };
        } else {
            // If no process is ready, skip to the next process arrival time
            currentTime = sortedProcesses[i].arrivalTime;
        }
    }

    yield { result: [...result], currentTime: null };
}

// Shortest Time to Completion First (STCF) / Preemptive SJF Scheduling Algorithm
export function* stcf(processes) {
    const result = [];
    let currentTime = 0;
    const readyQueue = [];

    const sortedProcesses = [...processes].sort((a, b) => a.arrivalTime - b.arrivalTime);
    let i = 0;

    // Clone processes to track remaining burst times and keep original burst time
    const remainingProcesses = sortedProcesses.map(p => ({
        ...p,
        remainingTime: p.burstTime,
        originalBurstTime: p.burstTime
    }));

    // Continue while there are processes to arrive or in the ready queue
    while (i < remainingProcesses.length || readyQueue.length > 0) {
        // Add all processes that have arrived by currentTime to the ready queue
        while (i < remainingProcesses.length && remainingProcesses[i].arrivalTime <= currentTime) {
            readyQueue.push(remainingProcesses[i]);
            i++;
        }

        if (readyQueue.length > 0) {
            // Sort ready queue by remaining time (shortest remaining time first)
            readyQueue.sort((a, b) => a.remainingTime - b.remainingTime);

            const process = readyQueue[0];

            // Calculate how long to run this process:
            // Either until completion or until a new process arrives
            const nextArrivalTime = i < remainingProcesses.length ? remainingProcesses[i].arrivalTime : Infinity;
            const timeToCompletion = process.remainingTime;
            const deltaTime = Math.min(timeToCompletion, nextArrivalTime - currentTime);

            // Run the process for deltaTime
            process.remainingTime -= deltaTime;
            currentTime += deltaTime;

            if (process.remainingTime === 0) {
                const completionTime = currentTime;
                const turnaroundTime = completionTime - process.arrivalTime;
                const waitingTime = turnaroundTime - process.originalBurstTime;

                result.push({
                    pid: process.pid,
                    completionTime,
                    turnaroundTime,
                    waitingTime,
                });

                readyQueue.shift(); // Remove process from ready queue
            }

            yield { result: [...result], currentTime };
        } else {
            // If no process is ready, skip to the next process arrival time
            currentTime = remainingProcesses[i].arrivalTime;
        }
    }

    yield { result: [...result], currentTime: null };
}

// Round Robin (RR) Scheduling Algorithm
export function* rr(processes, timeQuantum) {
    const result = [];
    let currentTime = 0;
    const readyQueue = [];

    const sortedProcesses = [...processes].sort((a, b) => a.arrivalTime - b.arrivalTime);
    let i = 0;

    // Clone processes to track remaining burst times and keep original burst time
    const remainingProcesses = sortedProcesses.map(p => ({
        ...p,
        remainingTime: p.burstTime,
        originalBurstTime: p.burstTime
    }));

    while (i < remainingProcesses.length || readyQueue.length > 0) {
        // Add all processes that have arrived by currentTime to the ready queue
        while (i < remainingProcesses.length && remainingProcesses[i].arrivalTime <= currentTime) {
            readyQueue.push(remainingProcesses[i]);
            i++;
        }

        if (readyQueue.length > 0) {
            const process = readyQueue.shift();

            // Run process for either the time quantum or remaining time
            const nextArrivalTime = i < remainingProcesses.length ? remainingProcesses[i].arrivalTime : Infinity;
            const executionTime = Math.min(process.remainingTime, timeQuantum);

            process.remainingTime -= executionTime;
            currentTime += executionTime;

            // Add newly arrived processes during this time
            while (i < remainingProcesses.length && remainingProcesses[i].arrivalTime <= currentTime) {
                readyQueue.push(remainingProcesses[i]);
                i++;
            }

            if (process.remainingTime === 0) {
                const completionTime = currentTime;
                const turnaroundTime = completionTime - process.arrivalTime;
                const waitingTime = turnaroundTime - process.originalBurstTime;

                result.push({
                    pid: process.pid,
                    completionTime,
                    turnaroundTime,
                    waitingTime,
                });
            } else {
                // Process isn't finished, re-queue it
                readyQueue.push(process);
            }

            yield { result: [...result], currentTime };
        } else {
            // If no process is ready, skip to the next process arrival time
            currentTime = remainingProcesses[i].arrivalTime;
        }
    }

    yield { result: [...result], currentTime: null };
}

// Multi-Level Feedback Queue (MLFQ) Scheduling Algorithm
export function* mlfq(processes) {
    const result = [];
    let currentTime = 0;

    // Define three queues with different time quantums
    const queues = [
        { timeQuantum: 4, processes: [] },
        { timeQuantum: 8, processes: [] },
        { timeQuantum: Infinity, processes: [] }
    ];

    const sortedProcesses = [...processes].sort((a, b) => a.arrivalTime - b.arrivalTime);
    let i = 0;

    // Clone processes to track remaining burst times and keep original burst time
    const remainingProcesses = sortedProcesses.map(p => ({
        ...p,
        remainingTime: p.burstTime,
        originalBurstTime: p.burstTime
    }));

    while (i < remainingProcesses.length || queues.some(q => q.processes.length > 0)) {
        // Add all processes that have arrived by currentTime to the highest priority queue
        while (i < remainingProcesses.length && remainingProcesses[i].arrivalTime <= currentTime) {
            queues[0].processes.push(remainingProcesses[i]);
            i++;
        }

        let foundProcess = false;

        // Iterate through queues from highest to lowest priority
        for (let q = 0; q < queues.length; q++) {
            if (queues[q].processes.length > 0) {
                const process = queues[q].processes.shift();

                // Run process for either the queue's time quantum or remaining time
                const nextArrivalTime = i < remainingProcesses.length ? remainingProcesses[i].arrivalTime : Infinity;
                const executionTime = Math.min(process.remainingTime, queues[q].timeQuantum, nextArrivalTime - currentTime);

                process.remainingTime -= executionTime;
                currentTime += executionTime;

                // Add newly arrived processes during this time
                while (i < remainingProcesses.length && remainingProcesses[i].arrivalTime <= currentTime) {
                    queues[0].processes.push(remainingProcesses[i]);
                    i++;
                }

                if (process.remainingTime === 0) {
                    const completionTime = currentTime;
                    const turnaroundTime = completionTime - process.arrivalTime;
                    const waitingTime = turnaroundTime - process.originalBurstTime;

                    result.push({
                        pid: process.pid,
                        completionTime,
                        turnaroundTime,
                        waitingTime,
                    });
                } else {
                    // Move process to the next lower priority queue if available
                    if (q < queues.length - 1) {
                        queues[q + 1].processes.push(process);
                    } else {
                        queues[q].processes.push(process);
                    }
                }

                foundProcess = true;

                yield { result: [...result], currentTime };
                break;
            }
        }

        if (!foundProcess) {
            // If no process is ready, skip to the next process arrival time
            currentTime = remainingProcesses[i].arrivalTime;
        }
    }

    yield { result: [...result], currentTime: null };
}

// Utility function to calculate average waiting time from the result
export const calculateAverageWaitingTime = (result) => {
    if (result.length === 0) return 0;

    const totalWaitingTime = result.reduce((sum, process) => sum + process.waitingTime, 0);
    return totalWaitingTime / result.length;
};
