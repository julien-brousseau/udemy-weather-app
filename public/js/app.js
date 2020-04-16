// Client-side app that gets runs in index.hbs

// Form HTML object references
const input = document.querySelector("input");
const $today = document.querySelector("#msg1");
const $tomorrow = document.querySelector("#msg2");

// Add event listener to the first form
document.querySelector("#form1").addEventListener("submit", async e => {

  // Clear text fields
  $today.textContent = "Fetching weather data ...";
  $tomorrow.textContent = "";

  // Prevent default submit action
  e.preventDefault();

  // Set default URL with address string as parameter
  let addressValue = "" + input.value;

  // If no address string is supplied, set address value as the browser geolocation coordinates instead
  if (!input.value) {
    var getPosition = function (options) {
      return new Promise((resolve, reject) => navigator.geolocation.getCurrentPosition(resolve, reject, options));
    }

    // Change address value for browser location coordinates
    await getPosition().then((position) => addressValue = position.coords.longitude + "," + position.coords.latitude )

      // Throw error if browser location is disabled
      .catch((err) => {
        $today.textContent = "Error: Unable to access browser location."
        throw new Error(err.message);
      });
  }

  // Fetch the JSON weather route
  fetch("/weather?address=" + addressValue).then((res) => {
    res.json().then((data) => {

      // Catch error in response
      if (data.error)
        $today.textContent = data.error;

      // Write weather forecast in correponding fields
      else {
        $today.innerHTML = `The current temperature in ${data.location} is ${data.today.temperature}°C
          (feels like ${data.today.apparent}°C).<br> The current weather is ${data.today.now.toLowerCase()},
          and today's forecast is ${data.today.forecast.toLowerCase()}`;

        $tomorrow.innerHTML = `Tomorrow's forecast is ${data.tomorrow.forecast.toLowerCase()} <br>
          The temperature will range between ${data.tomorrow.tempMin}°C and ${data.tomorrow.tempMax}°C,
          with a ${data.tomorrow.precip}% chance of ${data.tomorrow.precipType}`;
      }
    });
  });

})
