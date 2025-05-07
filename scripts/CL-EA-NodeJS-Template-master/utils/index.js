const { Requester, Validator } = require('@chainlink/external-adapter');
const { uploadToIPFS } = require('./ipfs.js');   
require('dotenv').config();

// Define custom parameters to be used by the adapter
const customParams = {
  lat: ['lat', 'latitude'],
  lon: ['lon', 'longitude'],
  service: ['service'], // Accepts "openweather", "openmeteo", or null (both)
};

const createRequest = async (input, callback, forecast = false) => {
  // Validate the input
  const validator = new Validator(callback, input, customParams);
  const jobRunID = validator.validated.id;

  // Extract and normalize parameters
  const lat = validator.validated.data.lat;
  const lon = validator.validated.data.lon;
  let service = validator.validated.data.service;

  // If service is null, undefined, or empty → fetch from both services
  const fetchBothServices = !service || service.trim() === "";

  // Store responses from both APIs
  let responses = [];

  if (fetchBothServices || service.toLowerCase() === 'openweather') {
    const appID = process.env.OPENWEATHER_API_KEY;
    if (appID) {
      try {
        const openWeatherConfig = {
          url: forecast
            ? `https://api.openweathermap.org/data/2.5/forecast`
            : `https://api.openweathermap.org/data/2.5/weather`,
          params: {
            lat,
            lon,
            appid: appID,
            units: 'metric', // Use metric system
          },
        };
        console.log("Fetching OpenWeather data...");
        const openWeatherResponse = await Requester.request(openWeatherConfig);
        responses.push({ service: 'openweather', data: openWeatherResponse.data });
      } catch (error) {
        console.warn("Failed to fetch OpenWeather data:", error.message);
      }
    } else {
      console.warn("Skipping OpenWeather request: API key missing.");
    }
  }

  if (fetchBothServices || service.toLowerCase() === 'openmeteo') {
    try {
      const openMeteoConfig = {
        url: `https://api.open-meteo.com/v1/forecast`,
        params: {
          latitude: lat,
          longitude: lon,
          current_weather: !forecast, // Fetch current weather if not a forecast
          hourly: forecast ? 'temperature_2m' : undefined,
        },
      };
      console.log("Fetching OpenMeteo data...");
      const openMeteoResponse = await Requester.request(openMeteoConfig);
      responses.push({ service: 'openmeteo', data: openMeteoResponse.data });
    } catch (error) {
      console.warn("Failed to fetch OpenMeteo data:", error.message);
    }
  }

  if (responses.length === 0) {
    return callback(400, {
      jobRunID,
      status: 'errored',
      error: "No valid service found or API calls failed",
      statusCode: 400,
    });
  }

  // Save the combined response to IPFS
  const filename = `weather_data_${new Date().toISOString().replace(/[:.]/g, '-')}.json`;
  const cid = await uploadToIPFS(JSON.stringify(responses, null, 2), filename);

  callback(200, {
    jobRunID,
    data: responses,
    result: responses,
    statusCode: 200,
    cid: cid // Return the CID
  });
};

// Handle requests for current weather (Fetches from both if service is null)
const handleWeatherRequest = (req, res) => {
  console.log('POST Data: ', req.body);
  createRequest(req.body, (status, result) => {
    console.log('Weather Result: ', result);
    res.status(status).json(result);
  }, false); // Current weather request (not forecast)
};

// Handle requests for weather forecasts (Fetches from both if service is null)
const handleForecastRequest = (req, res) => {
  console.log('POST Data: ', req.body);
  createRequest(req.body, (status, result) => {
    console.log('Forecast Result: ', result);
    res.status(status).json(result);
  }, true); // Forecast request
};

module.exports = {
  handleWeatherRequest,
  handleForecastRequest,
};
