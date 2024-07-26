const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const fs = require('fs');
const path = require('path');

module.exports = function (filePath = '', data) {
    const dir = path.dirname(filePath);
    
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }

    const headers = data[0].map(header => ({
        id: header,
        title: header
    }));

    const records = data.slice(1).map(row =>
        headers.reduce((obj, header, index) => {
            obj[header.id] = row[index];
            return obj;
        }, {})
    );

    const csvWriter = createCsvWriter({
        path: filePath,
        header: headers,
    });

    return csvWriter.writeRecords(records)

        .then(() => {
            console.log("Saved to file:", filePath);
            console.log("Total contacts:", records.length); // Исправлено, чтобы отражать количество записей, а не строк данных

            return filePath;
        })

        .catch(error => {
            console.error('Error writing CSV file:', error);
        });
}
