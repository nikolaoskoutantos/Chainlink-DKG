const { Requester, Validator } = require('@chainlink/external-adapter');
const { uploadToIPFS } = require('./ipfs.js');   
require('dotenv').config();

// Define custom parameters to be used by the adapter
const customParams = {
  lat: ['lat', 'latitude'],
  lon: ['lon', 'longitude'],
  service: ['service'], // Add the 'service' parameter
};

const createRequest = (input, callback, forecast = false) => {
  // Validate the input
  const validator = new Validator(callback, input, customParams);
  const jobRunID = validator.validated.id;

  // Extract and normalize the 'service' parameter
  const service = validator.validated.data.service.toLowerCase();
  const lat = validator.validated.data.lat;
  const lon = validator.validated.data.lon;

  let url;
  let params;

  // Determine the service and API to fetch data from
  if (service === 'openweather') {
    const appID = process.env.OPENWEATHER_API_KEY;
    if (!appID) {
      return callback(
        500,
        Requester.errored(jobRunID, 'Missing API Key for OpenWeather in environment variables')
      );
    }

    url = forecast
      ? `https://api.openweathermap.org/data/2.5/forecast` 
      : `https://api.openweathermap.org/data/2.5/weather`;

    params = {
      lat,
      lon,
      appid: appID,
      units: 'metric', // Optional: Adjust units as needed
    };
  } else if (service === 'openmeteo') {
    url = `https://api.open-meteo.com/v1/forecast`;
    params = {
      latitude: lat,
      longitude: lon,
      current_weather: !forecast, // Fetch current weather if not a forecast
      hourly: forecast ? 'temperature_2m' : undefined, // Example forecast field
    };
  } else {
    return callback(
      400,
      Requester.errored(jobRunID, `Unsupported service: ${service}`)
    );
  }

  const config = {
    url,
    params,
  };

  // Make the request and return the response
  Requester.request(config)
    .then(async (response) => {
      // Save the result to IPFS
      const filename = `weather_data_${new Date().toISOString().replace(/[:.]/g, '-')}.json`;
      const cid = await uploadToIPFS(JSON.stringify(response.data, null, 2), filename);

      callback(response.status, {
        jobRunID,
        data: response.data,
        result: response.data,
        statusCode: response.status,
        cid: cid // Return the CID
      });
    })
    .catch((error) => {
      callback(500, {
        jobRunID,
        status: 'errored',
        error: error.message || 'An error occurred',
      });
    });
};

// Handle requests for current weather
const handleWeatherRequest = (req, res) => {
  console.log('POST Data: ', req.body);
  createRequest(req.body, (status, result) => {
    console.log('Result: ', result);
    res.status(status).json(result);
  });
};

// Handle requests for weather forecasts
const handleForecastRequest = (req, res) => {
  console.log('POST Data: ', req.body);
  createRequest(req.body, (status, result) => {
    console.log('Forecast Result: ', result);
    res.status(status).json(result);
  }, true); // Pass 'true' for forecast
};

module.exports = {
  handleWeatherRequest,
  handleForecastRequest,
};
