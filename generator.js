const createCsvWriter = require('csv-writer').createObjectCsvWriter;

module.exports = function (filePath = '', data) {
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
            console.log("Total contacts:", data.length - 1);
            
            return filePath;
        })

        .catch(error => {
            console.error('Error writing CSV file:', error);
        });
}
