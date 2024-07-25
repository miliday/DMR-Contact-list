const axios = require('axios');

module.exports = function (config) {
    return axios.get(config.url, { params: config.params })
        .then(response => response.data.results)

        .catch(error => {

            console.error('Error fetching data from API:', error);
            return [];

        });
}
