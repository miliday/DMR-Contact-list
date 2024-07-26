const fetchApiContacts = require('./loaders/apiContacts');
const readCustomContacts = require('./loaders/customContacts');
const loadK2CallSigns = require('./loaders/K2CallSigns');
const generateCsvFile = require('./generator');
const dataCombiner = require('./combiner');
const moment = require('moment');

// const FILE_NAME = "MD9600-RT90";
const FILE_NAME = "ANYTONE";

Promise.all([

    fetchApiContacts({
        url: "https://radioid.net/api/dmr/user/",
        params: {
            country: 'ukraine'
        }
    }),

    Promise.resolve(loadK2CallSigns('./configuration/k2_call_signs.csv')),
    // Promise.resolve(readCustomContacts('./configuration/MD9600-RT90.csv')),
    Promise.resolve(readCustomContacts('./configuration/ANYTONE.csv'))

]).then(([api, k2, custom]) => {

    const raw = {api, k2, custom}
    const data = dataCombiner(raw, "ANYTONE") // Формат данних: "MD9600-RT90" або "ANYTONE"
    const path = `./generation/CL-${FILE_NAME}-${moment().format('YYYYMMDD-HHmmss')}.csv`

    return generateCsvFile(path, data);

}).catch(error => {

    console.error('Error in processing:', error);

});
