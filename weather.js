var http = require("http");
var https = require("https");
var printer = require("./printer");

var lat = "";
var long = "";
var zipCode = process.argv.slice(2,3);

// Convert zip code to lat/long
function convertZipCode(zip) {
	var request = http.get("http://maps.googleapis.com/maps/api/geocode/json?address=" + zip, function(response) {
		var responseBody = "";
		response.on("data", function(chunk) {
			responseBody += chunk;
		});

		response.on("end", function() {
			var zipData = JSON.parse(responseBody);
			zipData = zipData.results[0];

			if (response.statusCode === 200) {
				try {
					lat = zipData.geometry.location.lat;
					long = zipData.geometry.location.lng;
					city = zipData.address_components[1].long_name; // "Brownsburg"
					state = zipData.address_components[2].shart_name; // "IN"
					address = zipData.formatted_address;
				} catch(error) {
					printer.error(error.message);
				}
				getWeatherData(lat, long, address);
			} else {
				// Status Code error
				printer.error({message: "There was an error retreiving your ZIP code. (" + http.STATUS_CODES[response.statusCode] + ")"});
			}
		});
	});
}

// Request data from Forecast.io API
function getWeatherData(lat, long, address) {
	var url = "https://api.forecast.io/forecast/db78b4329b394c76ad89957ffc13f9b9/" + lat + "," + long;
	var request = https.get(url, function(response) {
		var body = "";
		response.on('data', function(chunk) {
			body += chunk;
		});

		response.on("end", function() {
			var weatherData = JSON.parse(body);
			if (response.statusCode === 200) {
				try {
					// Print Forecast.io data
					printer.currentWeather(weatherData, address);
				} catch(error) {
					printer.error(error.message);
				}
			} else {
				// Status Code error
				printer.error({message: "There was an error retreiving weather data for " + zip + ". (" + http.STATUS_CODES[response.statusCode] + ")"});
			}
		});

		}).on('error', function(error) {
		  printer.error(error.message);
		});
}




convertZipCode(zipCode);