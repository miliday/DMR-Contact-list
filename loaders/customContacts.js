const fs = require('fs');
const { parse } = require('csv-parse/sync');

module.exports = function (filePath, delimiter = ',') {
    try {
        const content = fs.readFileSync(filePath, { encoding: 'utf-8' });

        return parse(content, {
            trim: true,
            columns: true,
            skip_empty_lines: true,
            relax_column_count: true,
            delimiter: delimiter
        });

    } catch (error) {

        console.error('Error parsing custom contacts:', error);
        return [];

    }
}
