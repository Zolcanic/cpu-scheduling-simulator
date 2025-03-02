import React from 'react';
import ChartDisplay from './ChartDisplay';
import ProcessTable from './ProcessTable';
import { generatePDF } from '../utils/pdfGenerator';

const AlgorithmResults = ({ results, processes, running, currentTime }) => {
    const handleDownloadPDF = () => {
        generatePDF(results, processes);
    };

    return (
        <div>
        {Object.keys(results).length > 0 && (
            <>
            <button onClick={handleDownloadPDF}>Download PDF</button>
            {Object.entries(results).map(([algorithm, result]) => (
                <div key={algorithm}>
                <h2>{algorithm.toUpperCase()}</h2>
                <ProcessTable processes={processes} result={result} />

                <ChartDisplay
                result={result}
                algorithm={algorithm}
                running={running}
                currentTime={currentTime}
                processes={processes}
                />
                </div>
            ))}
            </>
        )}
        </div>
    );
};

export default AlgorithmResults;
