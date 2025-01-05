const input = document.querySelector(".input");
const CityName = document.querySelector(".CityName");
const weatherDescription = document.querySelector(".description");
const temperature = document.querySelector(".temperature");
const humidityPer = document.querySelector(".humidity-per");
const windSpeed = document.querySelector(".wind-speed");
const WeatherIMG = document.querySelector(".weather-icon");
const HourlyWeatherList = document.querySelector(".weather-list");
const locationBtn = document.querySelector(".location");
const WeatherSection= document.querySelector(".weather-section");
const noResults = document.querySelector(".no-results");
const inputInfo = document.querySelector(".input-info");

const API_KEY = "29c8933c25784bd48fb155001250501"


//Handling User Input
input.addEventListener("keyup", (e) => {
    const cityName = input.value.trim();
    if (e.key == 'Enter'&&cityName) {
        setWeatherRequest(cityName);   
    }
});

//Hourly weather display
const displayHourlyForecast = (combinedHourlyData) => {

    const currentHour = new Date().setMinutes(0, 0, 0);
    const next24Hours = currentHour + 24 * 60 * 60 * 1000;

    //Filter hourly data till next 24 hours
    const next24HoursData = combinedHourlyData.filter(({ time }) => {
        const forecastTime = new Date(time).getTime();
        return forecastTime >= currentHour && forecastTime <= next24Hours;
    });
    // console.log(next24HoursData);
    //Fetching and displaying hourly weather on UI
    HourlyWeatherList.innerHTML  = next24HoursData.map((item) => {
        const temperatureAPI = Math.floor(item.temp_c);
        const WeatherIcon = (item.condition.icon);
        const time = (item.time.split(' ')[1].substring(0,5));

        return `<li class="weather-item">
                    <p class="time">${time}</p>
                    <img src=${WeatherIcon} alt="" class="weather-icon">
                    <p class="temperature">${temperatureAPI}&deg;C</p>
                </li>`
    }).join("")
};



const getWeatherDetails = async (API_URL) => {
    //Keyboard blur
    window.innerWidth <= 768 && input.blur();
    document.body.classList.remove("show-no-results");

    try {
        //Fetching Weather data
        const response = await fetch(API_URL);
        const data = await response.json();

        //Extracting weather data
        const temperatureAPI = Math.floor(data.current.temp_c);
        const weatherAPI = data.current.condition.text;
        const humidityAPI = data.current.humidity;
        const windKph = Math.floor(data.current.wind_kph);
        const WeatherIcon = data.current.condition.icon;
        const city = data.location.name;

        //Displaying city name 
        CityName.innerHTML = city;
        input.value = '';


        //Displaying weather data in UI
        weatherDescription.innerHTML = weatherAPI;
        windSpeed.innerHTML=`${windKph}km/h`
        temperature.innerHTML = `${temperatureAPI}°C`;
        humidityPer.innerHTML = `${humidityAPI}%`;
        WeatherIMG.src = WeatherIcon;
             
        //Hourly data extraction
        const combinedHourlyData = [...data.forecast.forecastday[0].hour, ...data.forecast.forecastday[1].hour];
        displayHourlyForecast(combinedHourlyData);

        // console.log(data);

    } catch (error) {
        //Handling error
        // console.log(error);
        document.body.classList.add("show-no-results");
        input.value = "";
    }
}

//Weather display by search
const setWeatherRequest = (cityName) => {
    const API_URL = `http://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${cityName}&days=2`;
    getWeatherDetails(API_URL);
}


//Weather display using Location button
locationBtn.addEventListener("click", () => {
    navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        const API_URL = `http://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${latitude}&q=${longitude}&days=2`;        
        getWeatherDetails(API_URL);
    }, (error) => {
        alert("Location access denied. Please enable permissions  to use this feature");
    })
});

setWeatherRequest("Mumbai");
