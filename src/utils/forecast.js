/*
  Forecast module
  Takes latitude and longitude arguments, with a callback function (error, data)
  Returns an object containing the weather data for the location
*/

// Dependancies
const request = require("request");

// Export object
const forecast = (latitude, longitude, callback) => {

  // Darksky API token
  const token = process.env.DARKSKY_API;

  // URL Parameters - coordinates and units
  const tail = latitude + "," + longitude + "?units=si";

  // Complete request URL
  const url = "https://api.darksky.net/forecast/" + token + tail;

  // HTTP request to the Darksky API
  request({ url, json: true }, (err, { body }) => {

    // Check for errors from Request
    if (err) {
      callback("Unable to connect to weather service", undefined);

    // Check for errors from response
    } else if (body.error) {
      callback("Invalid location", undefined);

    // Forecast object for today and tomorrow
    } else {
      const data = {
        today: {
          forecast: body.hourly.summary,
          now: body.currently.summary,
          temperature: Math.ceil(body.currently.temperature),
          apparent: Math.ceil(body.currently.apparentTemperature),
        },
        tomorrow: {
          forecast: body.daily.data[1].summary,
          tempMax: Math.ceil(body.daily.data[1].temperatureHigh),
          tempMin: Math.ceil(body.daily.data[1].temperatureLow),
          precip: body.daily.data[1].precipProbability * 100,
          precipType: body.daily.data[1].precipType,
        }
      }

      // Return the forecast object
      callback(undefined, data);
    }

  });
}

// Export the module
module.exports = forecast;
