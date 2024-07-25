const fs = require('fs');
const { parse } = require('csv-parse/sync');

module.exports = function (filePath) {
    try {
        const content = fs.readFileSync(filePath, { encoding: 'utf-8' });

        const records = parse(content, {
            trim: true,
            quote: '"',
            columns: true,
            skip_empty_lines: true,
            relax_column_count: true,
            relax_quotes: true,
        });

        const k2CallSigns = {};

        records.forEach(record => {
            if (record.DMR_ID !== 'null' && record.DMR_ID) {
                k2CallSigns[record.DMR_ID] = record.K2CallSign;
            }
        });

        return k2CallSigns;

    } catch (error) {

        console.error('Error parsing K2 call signs:', error);
        return {};
    }
}