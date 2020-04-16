// Dependancies
const chalk = require("chalk");
const path = require("path");

// Routing
const express = require("express");

// Custom weather/geo modules
const geocode = require("./utils/geocode");
const forecast = require("./utils/forecast");

// Templating
const hbs = require("hbs");


// SETTINGS

// Initialize Express app object
const app = express();

// Environment variable (automatically set by Heroku)
const port = process.env.PORT || 3000;

// Setup Handlebars variables
app.set("view engine", "hbs");
app.set('views', path.join(__dirname, '../templates/views'));
hbs.registerPartials(path.join(__dirname, '../templates/partials'));

// Default route choice for static pages and css/img/js/etc..
app.use(express.static(path.join(__dirname, "../public")));


// ROUTES

// Render HBS views with variables
app.get("", (req, res) => {
  res.render("index", {
    title: "Weather app",
    name: "Blop!"
  });
});

app.get("/about", (req, res) => {
  res.render("about", {
    title: "About this app",
    name: "Blop!"
  });
});

app.get("/help", (req, res) => {
  res.render("help", {
    title: "Get some help",
    name: "Blop!",
    helpMsg: "Help page"
  });
});

// 404 route for a specific section
app.get("/help/*", (req, res) => {
  res.render("404", {
    title: "404",
    name: "Blop!",
    errorMsg: "Seems like you need some... help?"
  });
});

// JSON response for geolocation + weather query
app.get("/weather", (req, res) => {

  // Catch missing address
  if (!req.query.address) {
    return res.send({ error: "Missing address" });
  }

  // Call the geocode module with default object parameter to avoid error
  geocode(req.query.address, (err, { latitude, longitude, location } = {}) => {

    // Catch geocode module errors
    if (err) return res.send({ error: err });

    // Call forecast module if address is valid
    forecast(latitude, longitude, (err, forecastData) => {

      // Catch forecast module errors
      if (err) return res.send({ error: err });

      // Send data
      res.send({
        summary: forecastData.summary,
        temperature: forecastData.temperature,
        location,
      });

    })

  })

});

// JSON response for local weather based on browser location
app.get("/localWeather", (req, res) => {

  // Call forecast module if address is valid
  forecast(req.query.latitude, req.query.longitude, (err, forecastData) => {

    // Catch forecast module errors
    if (err) return res.send({ error: err });

    // Send data
    res.send({
      summary: forecastData.summary,
      temperature: forecastData.temperature,
      location: "Weather at your current location: ",
    });

  })

});

// 404 route for anything else
app.get("*", (req, res) => {
  res.render("404", {
    title: "404",
    name: "Blop!",
    errorMsg: "Ehh no... just.. just no."
  });
});


// Start the server
app.listen(port, () => {
  console.log("Server started on port " + port);
});