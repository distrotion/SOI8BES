const axios = require('axios');

const TIMEOUT_MS = 30000;

exports.post = async (url, body) => {
  let output;
  await axios.post(url, body, { timeout: TIMEOUT_MS })
    .then(res => {
      output = res.data;
    })
    .catch(error => {
      const status = error.response?.status ?? 'network_error';
      console.error(status);
      output = status;
    });
  return output;
};

exports.get = async (url) => {
  let output;
  await axios.get(url, { timeout: TIMEOUT_MS })
    .then(res => {
      output = res.data;
    })
    .catch(error => {
      const status = error.response?.status ?? 'network_error';
      console.error(status);
      output = status;
    });
  return output;
};
