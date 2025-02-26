import jsPDF from 'jspdf';

export const generatePDF = (results, processes) => {
    const doc = new jsPDF();
    doc.text('CPU Scheduling Results', 10, 10);

    let y = 20;
    Object.entries(results).forEach(([algorithm, result]) => {
        doc.text(algorithm.toUpperCase(), 10, y);
        y += 10;

        processes.forEach((process) => {
            const processResult = result.find((item) => item.pid === process.pid);
            if (processResult) {
                doc.text(`P${process.pid}: CT=${processResult
