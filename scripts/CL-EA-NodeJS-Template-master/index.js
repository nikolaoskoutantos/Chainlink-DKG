const { Requester, Validator } = require('@chainlink/external-adapter');
require('dotenv').config();

// Define custom parameters to be used by the adapter
const customParams = {
  lat: ['lat', 'latitude'],
  lon: ['lon', 'longitude'],
};

const createRequest = (input, callback) => {
  // Validate the input
  const validator = new Validator(callback, input, customParams);
  const jobRunID = validator.validated.id;

  // OpenWeather API key (set as an environment variable for security)
  const appID = process.env.OPENWEATHER_API_KEY; 
  if (!appID) {
    return callback(
      500,
      Requester.errored(jobRunID, 'Missing API Key in environment variables')
    );
  }

  const lat = validator.validated.data.lat;
  const lon = validator.validated.data.lon;

  const url = `https://api.openweathermap.org/data/2.5/weather`;

  const params = {
    lat,
    lon,
    appid: appID,
    units: 'metric', // Optional: Adjust units as needed
  };

  const config = {
    url,
    params,
  };

  // Make the request and directly return the API response
  Requester.request(config)
    .then((response) => {
      // Return the response as-is with Chainlink's expected format
      callback(response.status, {
        jobRunID,
        data: response.data,
        result: response.data,
        statusCode: response.status,
      });
    })
    .catch((error) => {
      // Pass a properly formatted error response
      callback(500, {
        jobRunID,
        status: 'errored',
        error: error.message || 'An error occurred',
      });
    });
};

module.exports.createRequest = createRequest;
