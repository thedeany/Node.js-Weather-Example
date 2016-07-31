function printError(error) {
	console.error("There was an error retreiving weather data:\n\n" + error);
}

function printCurrentWeather(weatherData, address) {
	var current = weatherData.currently;
	var daily = weatherData.daily;

	var summary = current.summary;
	var tempCurrent = Math.round(current.temperature);
	var tempHigh = Math.round(daily.data[0].temperatureMax);
	var tempLow = Math.round(daily.data[0].temperatureMin);
	var feelsLike = Math.round(current.apparentTemperature);
	var humidity = Math.round((current.humidity * 100)) + "%";

	var message = "Current weather for " + address + ": ";
	message += summary;
	message += " and " + tempCurrent;
	message += " (feels like " + feelsLike + ")";
	message += " with a high of " + tempHigh;
	message += " and a low of " + tempLow + ".";
	message += " The humidity is " + humidity + ".";

	console.log(message);
}


module.exports.error = printError;
module.exports.currentWeather = printCurrentWeather;