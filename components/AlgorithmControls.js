import React from 'react';

const AlgorithmControls = ({ numProcesses, setNumProcesses, timeQuantum, setTimeQuantum, onGenerate, onRun, running }) => {
    return (
        <div>
        <label>Number of Processes:</label>
        <input type="number" value={numProcesses} onChange={(e) => setNumProcesses(parseInt(e.target.value))} />
        <label>Time Quantum (RR):</label>
        <input type="number" value={timeQuantum} onChange={(e) => setTimeQuantum(parseInt(e.target.value))} />
        <button onClick={onGenerate}>Generate Processes</button>
        <button onClick={onRun} disabled={running}>Run Algorithms</button>
        </div>
    );
};

export default AlgorithmControls;
