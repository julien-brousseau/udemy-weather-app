// Dependancies
const request = require("request");

// Returns a weather object based on coordinates, or an error string
const forecast = (latitude, longitude, callback) => {

  // Darksky API token
  const token = process.env.DARKSKY_API;

  // URL Options
  const tail = latitude + "," + longitude + "?units=si";

  // Complete URL
  const url = "https://api.darksky.net/forecast/" + token + tail;

  // HTTP request for the Darksky API
  request({ url, json: true }, (err, { body }) => {

    // Check for errors from Request
    if (err) {
      callback("Unable to connect to weather service", undefined);

    // Check for errors from response
    } else if (body.error) {
      callback("Invalid location", undefined);

    // Return the temperature and summary, with error argument undefined
    } else {
      callback(undefined, {
        temperature: Math.ceil(body.currently.temperature),
        summary: body.daily.data[0].summary
      })
    }

  });
}

// Export the module
module.exports = forecast;
