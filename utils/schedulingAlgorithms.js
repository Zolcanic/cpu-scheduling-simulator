// utils/schedulingAlgorithms.js

// First In First Out (FIFO) Scheduling Algorithm
export function* fifo(processes) {
    const result = [];       // Stores the result of scheduling (pid, completionTime, turnaroundTime, waitingTime)
    let currentTime = 0;     // Tracks the current time in the simulation

    // Sort processes by arrival time (earliest arrival first)
    const sortedProcesses = [...processes].sort((a, b) => a.arrivalTime - b.arrivalTime);

    // Iterate through each process in sorted order
    for (const process of sortedProcesses) {
        // If the process hasn't arrived yet, move currentTime forward to its arrival time
        if (process.arrivalTime > currentTime) {
            currentTime = process.arrivalTime;
        }

        // Calculate process completion time
        const completionTime = currentTime + process.burstTime;

        // Turnaround time = completion time - arrival time
        const turnaroundTime = completionTime - process.arrivalTime;

        // Waiting time = turnaround time - burst time
        const waitingTime = turnaroundTime - process.burstTime;

        // Store the computed values in the result
        result.push({
            pid: process.pid,
            completionTime,
            turnaroundTime,
            waitingTime,
        });

        // Move currentTime forward by the burst time of the process
        currentTime = completionTime;

        // Yield intermediate result after each process execution
        yield { result: [...result], currentTime };
    }

    // Final yield to signal the algorithm is complete
    yield { result: [...result], currentTime: null };
}

// Shortest Job First (SJF) Non-preemptive Scheduling Algorithm
export function* sjf(processes) {
    const result = [];       // Stores the scheduling result
    let currentTime = 0;     // Tracks current time in the simulation
    const readyQueue = [];   // Queue for processes that have arrived and are ready to execute

    // Sort processes by their arrival times
    const sortedProcesses = [...processes].sort((a, b) => a.arrivalTime - b.arrivalTime);

    let i = 0; // Index to track processes that have not yet arrived

    // Run until all processes have been handled
    while (i < sortedProcesses.length || readyQueue.length > 0) {
        // Add all processes that have arrived by currentTime to the readyQueue
        while (i < sortedProcesses.length && sortedProcesses[i].arrivalTime <= currentTime) {
            readyQueue.push(sortedProcesses[i]);
            i++;
        }

        // Sort readyQueue by burst time (shortest first)
        readyQueue.sort((a, b) => a.burstTime - b.burstTime);

        if (readyQueue.length > 0) {
            const process = readyQueue.shift(); // Select the process with the shortest burst time

            // Calculate completion, turnaround, and waiting times
            const completionTime = currentTime + process.burstTime;
            const turnaroundTime = completionTime - process.arrivalTime;
            const waitingTime = turnaroundTime - process.burstTime;

            // Store the computed values in the result
            result.push({
                pid: process.pid,
                completionTime,
                turnaroundTime,
                waitingTime,
            });

            // Advance currentTime
            currentTime = completionTime;

            // Yield intermediate result after executing a process
            yield { result: [...result], currentTime };
        } else {
            // No process is ready, increment time
            currentTime++;
            yield { result: [...result], currentTime };
        }
    }

    // Final yield to signal the algorithm is complete
    yield { result: [...result], currentTime: null };
}

// Shortest Time to Completion First (STCF) / Preemptive SJF Scheduling Algorithm
export function* stcf(processes) {
    const result = [];       // Stores the scheduling result
    let currentTime = 0;     // Tracks current time in the simulation
    const readyQueue = [];   // Queue of ready processes

    // Sort processes by their arrival times
    const sortedProcesses = [...processes].sort((a, b) => a.arrivalTime - b.arrivalTime);

    let i = 0; // Index for sortedProcesses

    // Run until all processes are handled
    while (i < sortedProcesses.length || readyQueue.length > 0) {
        // Add processes that have arrived by currentTime to the readyQueue
        while (i < sortedProcesses.length && sortedProcesses[i].arrivalTime <= currentTime) {
            readyQueue.push(sortedProcesses[i]);
            i++;
        }

        // Sort readyQueue by remaining burst time (shortest remaining first)
        readyQueue.sort((a, b) => {
            const remainingA = a.burstTime;
            const remainingB = b.burstTime;
            return remainingA - remainingB;
        });

        if (readyQueue.length > 0) {
            const process = readyQueue[0]; // Select the process with the shortest remaining burst time

            // Execute the process for 1 time unit
            process.burstTime--;

            if (process.burstTime === 0) {
                // If the process is finished, calculate metrics
                const completionTime = currentTime + 1;
                const turnaroundTime = completionTime - process.arrivalTime;
                const waitingTime = turnaroundTime - (process.originalBurstTime || 0);

                result.push({
                    pid: process.pid,
                    completionTime,
                    turnaroundTime,
                    waitingTime,
                });

                // Remove the finished process from the readyQueue
                readyQueue.shift();
            }

            // Move time forward by 1 unit
            currentTime++;

            // Yield the current state after each time unit
            yield { result: [...result], currentTime };
        } else {
            // No process is ready; move time forward
            currentTime++;
            yield { result: [...result], currentTime };
        }
    }

    // Final yield to signal completion
    yield { result: [...result], currentTime: null };
}

// Round Robin (RR) Scheduling Algorithm
export function* rr(processes, timeQuantum) {
    const result = [];       // Stores the scheduling result
    let currentTime = 0;     // Tracks current time
    const readyQueue = [];   // Queue of ready processes

    // Sort processes by arrival times
    const sortedProcesses = [...processes].sort((a, b) => a.arrivalTime - b.arrivalTime);

    let i = 0; // Index for sortedProcesses

    // Run until all processes are handled
    while (i < sortedProcesses.length || readyQueue.length > 0) {
        // Add processes that have arrived to the readyQueue
        while (i < sortedProcesses.length && sortedProcesses[i].arrivalTime <= currentTime) {
            readyQueue.push(sortedProcesses[i]);
            i++;
        }

        if (readyQueue.length > 0) {
            const process = readyQueue.shift(); // Dequeue the first process in the readyQueue

            // Execute for timeQuantum or remaining burst time
            const executionTime = Math.min(process.burstTime, timeQuantum);
            process.burstTime -= executionTime;

            // Advance currentTime
            currentTime += executionTime;

            if (process.burstTime === 0) {
                // Process is complete
                const completionTime = currentTime;
                const turnaroundTime = completionTime - process.arrivalTime;
                const waitingTime = turnaroundTime - (process.originalBurstTime || 0);

                result.push({
                    pid: process.pid,
                    completionTime,
                    turnaroundTime,
                    waitingTime,
                });
            } else {
                // Process is not finished, add it back to the queue
                readyQueue.push(process);
            }

            // Yield intermediate result after each timeQuantum slice
            yield { result: [...result], currentTime };
        } else {
            // No process is ready; move time forward
            currentTime++;
            yield { result: [...result], currentTime };
        }
    }

    // Final yield to signal completion
    yield { result: [...result], currentTime: null };
}

// Multi-Level Feedback Queue (MLFQ) Scheduling Algorithm
export function* mlfq(processes) {
    const result = [];       // Stores the scheduling result
    let currentTime = 0;     // Tracks current time

    // Define multiple queues with different timeQuantums and priorities
    const queues = [
        { timeQuantum: 4, processes: [] },       // Highest priority queue
        { timeQuantum: 8, processes: [] },       // Medium priority queue
        { timeQuantum: Infinity, processes: [] } // Lowest priority queue (FCFS)
    ];

    // Sort processes by arrival time
    const sortedProcesses = [...processes].sort((a, b) => a.arrivalTime - b.arrivalTime);

    let i = 0; // Index for sortedProcesses

    // Run until all queues and processes are empty
    while (i < sortedProcesses.length || queues.some(queue => queue.processes.length > 0)) {
        // Add newly arrived processes to the highest priority queue
        while (i < sortedProcesses.length && sortedProcesses[i].arrivalTime <= currentTime) {
            queues[0].processes.push(sortedProcesses[i]);
            i++;
        }

        let currentQueue = 0; // Start with the highest priority queue
        while (currentQueue < queues.length) {
            if (queues[currentQueue].processes.length > 0) {
                const process = queues[currentQueue].processes.shift(); // Get the first process in the queue

                // Execute the process for its queue's timeQuantum or remaining burst time
                const executionTime = Math.min(process.burstTime, queues[currentQueue].timeQuantum);
                process.burstTime -= executionTime;

                // Move currentTime forward
                currentTime += executionTime;

                if (process.burstTime === 0) {
                    // Process is complete
                    const completionTime = currentTime;
                    const turnaroundTime = completionTime - process.arrivalTime;
                    const waitingTime = turnaroundTime - (process.originalBurstTime || 0);

                    result.push({
                        pid: process.pid,
                        completionTime,
                        turnaroundTime,
                        waitingTime,
                    });
                } else {
                    // Process not complete, move to the next lower priority queue (if possible)
                    if (currentQueue < queues.length - 1) {
                        queues[currentQueue + 1].processes.push(process);
                    } else {
                        // Already at lowest priority, re-add to the same queue
                        queues[currentQueue].processes.push(process);
                    }
                }

                // Yield after each process execution
                yield { result: [...result], currentTime };
                break; // After handling one process, return to the arrival queue check
            } else {
                // Move to the next lower priority queue
                currentQueue++;
            }
        }

        // If no process was found in any queue, move time forward
        if (currentQueue === queues.length) {
            currentTime++;
            yield { result: [...result], currentTime };
        }
    }

    // Final yield to signal the algorithm is complete
    yield { result: [...result], currentTime: null };
}

// Utility function to calculate average waiting time from the result
export const calculateAverageWaitingTime = (result) => {
    if (result.length === 0) {
        return 0; // No processes, return 0
    }

    // Sum all waiting times and divide by number of processes
    const totalWaitingTime = result.reduce((sum, process) => sum + process.waitingTime, 0);
    return totalWaitingTime / result.length;
};
