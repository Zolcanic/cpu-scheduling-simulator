export const generateProcesses = (numProcesses) => {
    const processes = [];
    for (let i = 0; i < numProcesses; i++) {
        processes.push({
            pid: i + 1,
            arrivalTime: Math.floor(Math.random() * 10),
                       burstTime: Math.floor(Math.random() * 15) + 1,
        });
    }
    return processes.sort((a, b) => a.arrivalTime - b.arrivalTime);
};
