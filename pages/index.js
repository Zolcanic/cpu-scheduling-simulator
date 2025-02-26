import React, { useState } from 'react';
import AlgorithmControls from '../components/AlgorithmControls';
import AlgorithmResults from '../components/AlgorithmResults';
import { generateProcesses } from '../utils/processGenerator';
import { fifo, sjf, stcf, rr, mlfq } from '../utils/schedulingAlgorithms';

export default function Home() {
    const [processes, setProcesses] = useState([]);
    const [numProcesses, setNumProcesses] = useState(5);
    const [timeQuantum, setTimeQuantum] = useState(2);
    const [results, setResults] = useState({});
    const [running, setRunning] = useState(false);

    const handleGenerateProcesses = () => {
        setProcesses(generateProcesses(numProcesses));
    };

    const handleRunAlgorithms = () => {
        setRunning(true);
        const fifoResult = fifo([...processes]);
        const sjfResult = sjf([...processes]);
        const stcfResult = stcf([...processes]);
        const rrResult = rr([...processes], timeQuantum);
        const mlfqResult = mlfq([...processes]);

        setResults({
            fifo: fifoResult,
            sjf: sjfResult,
            stcf: stcfResult,
            rr: rrResult,
            mlfq: mlfqResult,
        });
        setRunning(false);
    };

    return (
        <div>
        <h1>CPU Scheduling Simulator</h1>
        <AlgorithmControls
        numProcesses={numProcesses}
        setNumProcesses={setNumProcesses}
        timeQuantum={timeQuantum}
        setTimeQuantum={setTimeQuantum}
        onGenerate={handleGenerateProcesses}
        onRun={handleRunAlgorithms}
        running={running}
        />
        {processes.length > 0 && <AlgorithmResults results={results} processes={processes} running={running} />}
        </div>
    );
}
