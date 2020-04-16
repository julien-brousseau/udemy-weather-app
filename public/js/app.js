// Client-side app that gets runs in index.hbs

// Form HTML object references
const input = document.querySelector("input");
const msg1 = document.querySelector("#msg1");
const msg2 = document.querySelector("#msg2");

// Add event listener to the first form
document.querySelector("#form1").addEventListener("submit", e => {

  // Default txt
  msg1.textContent = "Loading ...";
  msg2.textContent = "";

  // Prevent default submit action
  e.preventDefault();

  // Fetch an URL, then call a Promise
  fetch("/weather?address=" + input.value).then((res) => {

    // Parse response as JSON
    res.json().then((data) => {

      // Catch error in response
      if (data.error)
        msg1.textContent = data.error;

      // Write weather forecast in correponding fields
      else {
        msg1.innerHTML = `The current temperature in ${data.location} is ${data.today.temperature}°C
          (feels like ${data.today.apparent}°C).<br> The current weather is ${data.today.now.toLowerCase()},
          and today's forecast is ${data.today.forecast.toLowerCase()}`;

        msg2.innerHTML = `Tomorrow's forecast is ${data.tomorrow.forecast.toLowerCase()} <br>
          The temperature will be ${data.tomorrow.tempMin}-${data.tomorrow.tempMin}°C, with a ${data.tomorrow.precip}% chance of ${data.tomorrow.precipType}`;
      }
    });

  });

})

// Add event listener to the local form
document.querySelector("#form2").addEventListener("submit", e => {

  // Default txt
  msg1.textContent = "Loading ...";
  msg2.textContent = "";

  // Prevent default submit action
  e.preventDefault();

  // Get browser geolocalisation
  navigator.geolocation.getCurrentPosition((position) => {

    // Get server weather based on location coords
    fetch("/localWeather?latitude=" + position.coords.latitude + "&longitude=" + position.coords.longitude).then((res) => {

      // Parse response as JSON
      res.json().then((data) => {

        // Catch error in response
        if (data.error)
          msg1.textContent = data.error;

        // Write data in correponding fields
        else {
          msg1.textContent = data.location;
          msg2.textContent = "Temperature is " + data.temperature + "°C, forecast is " + data.summary.toLowerCase();
        }

      });

    });

  });

})
