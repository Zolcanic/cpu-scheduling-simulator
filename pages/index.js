import { useState, useEffect, useRef } from 'react';
import AlgorithmControls from '../components/AlgorithmControls';
import AlgorithmResults from '../components/AlgorithmResults';
import { generateProcesses } from '../utils/processGenerator';
import { fifo } from '../utils/schedulingAlgorithms';

// useInterval Hook
function useInterval(callback, delay) {
    const savedCallback = useRef();

    useEffect(() => {
        savedCallback.current = callback;
    }, [callback]);

    useEffect(() => {
        function tick() {
            savedCallback.current();
        }
        if (delay !== null) {
            const id = setInterval(tick, delay);
            return () => clearInterval(id);
        }
    }, [delay]);
}

export default function Home() {
    const [processes, setProcesses] = useState([]); // ✅ Initialized as an empty array
    const [numProcesses, setNumProcesses] = useState(5);
    const [timeQuantum, setTimeQuantum] = useState(2);
    const [results, setResults] = useState({ fifo: [] }); // ✅ Ensure default value is an empty array
    const [running, setRunning] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const generatorRef = useRef(null);

    const handleGenerateProcesses = () => {
        setProcesses(generateProcesses(numProcesses));
    };

    const handleRunAlgorithms = () => {
        setRunning(true);
        generatorRef.current = fifo([...processes]);
        handleNextStep();
    };

    const handleNextStep = () => {
        const { value, done } = generatorRef.current.next();
        if (done) {
            setRunning(false);
            setCurrentTime(0);
            generatorRef.current = null;
        } else {
            setResults({ fifo: value.result });
            setCurrentTime(value.currentTime);
        }
    };

    useInterval(() => {
        if (running) {
            handleNextStep();
        }
    }, 1000); // Update every 1000ms (1 second)

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
        {/* ✅ Ensured processes is defined before accessing length */}
        {processes.length > 0 && (
            <AlgorithmResults results={results} processes={processes} running={running} currentTime={currentTime} />
        )}
        </div>
    );
}
