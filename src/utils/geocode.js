// Dependancies
const request = require("request");

// Returns the coordinates from an address using Mapbox API,
//  or an error string
const geocode = (address, callback) => {

  // Mapbox API token
  const token = process.env.MAPBOX_API;

  // URL Variables
  const tail = "&limit=1";

  // Complete URL
  const url = "https://api.mapbox.com/geocoding/v5/mapbox.places/"
    + encodeURIComponent(address) + ".json?access_token=" + token + tail;

  // HTTP request to Mapbox API
  request({ url, json: true }, (err, { body }) => {

      // Check for errors from Request
      if (err) {
        callback("Unable to connect to location service", undefined)

      // Check for empty response
      } else if (body.features.length === 0) {
        callback("Unable to find location", undefined)

      // Return the coordinates and location
      } else {
        callback(undefined, {
          latitude: body.features[0].center[1],
          longitude: body.features[0].center[0],
          location: body.features[0].place_name
        })
      }
  });

}

// Export the module
module.exports = geocode;
