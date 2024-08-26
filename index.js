import {api} from './api.js';

const container = document.querySelector('.container');
const search = document.querySelector('.search-box button');
const weatherBox = document.querySelector('.weather-box');
const weatherDetails = document.querySelector('.weather-details');
const error404 = document.querySelector('.not-found');

// search time measurement
var startTime = 0;
var endTime = 0;

// changed fetch/then -> async/await
search.addEventListener('click', async() => {
    startTime = Date.now();
    console.log(`Start Time is ${startTime}`);
    const APIKey = api;
    const city = document.querySelector('.search-box input').value;
    if (city === '') {
        console.log(`City is empty`);
        return;
    }
    // need to pares the longitude and latitude to get weather info
    // first fetch the longitude and latitude of the city by using geo API 
    console.log(`Fetching data for a city: ${city}`);
    try {
        const geoResponse = await fetch (`http://api.openweathermap.org/geo/1.0/direct?q=${city}&appid=${APIKey}`)
        if (!geoResponse.ok) throw new Error('Geo API error')
        else console.log('Geo API response', geoResponse);

        const geoData = await geoResponse.json();
        console.log('Geo API Data', geoData);

        const lat = geoData[0].lat;
        const lon = geoData[0].lon;

        const weatherResponse = await fetch (`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${APIKey}`);
        if (!weatherResponse.ok) throw new Error('Weather API error');
        else console.log('Weather API response:', weatherResponse);

        const weatherData = await weatherResponse.json();    
        console.log('Weather API data', weatherData);

        // when the weather data for corresponding longitude and latitude is not found
        if (weatherData.cod === '404') {
            container.style.height = '400px';
            weatherBox.style.display = 'none';
            weatherDetails.style.display = 'none';
            error404.style.display = 'block';
            error404.classList.add('fadeIn');                
            return;
        }

        error404.style.display = 'none';
        error404.classList.remove('fadeIn');

        const image = document.querySelector('.weather-box img');
        const temperature = document.querySelector('.weather-box .temperature');
        const description = document.querySelector('.weather-box .description');
        const humidity = document.querySelector('.weather-details .humidity span');
        const wind = document.querySelector('.weather-details .wind span');
        
        // need to add the case for thunderstorm
        switch (weatherData.weather[0].main) {
            case 'Clear':
                image.src = 'images/clear.png';
                break;
            case 'Rain':
                image.src = 'images/rain.png';
                break;
            case 'Snow':
                image.src = 'images/snow.png';
                break;
            case 'Haze':
                image.src = 'images/haze.png';
                break;
            case 'Clouds':
                image.src = 'images/cloud.png';
                break;
            default:
                image.src = '';
        }
        
        // round up the temperature to one decimal place.
        temperature.innerHTML = `${Math.round((parseInt(weatherData.main.temp)-273.15)*10)/10}<span> °C</span>`;
        description.innerHTML = `${weatherData.weather[0].description}`;
        humidity.innerHTML = `${weatherData.main.humidity}%`;
        wind.innerHTML = `${parseInt(weatherData.wind.speed)}Km/h`;

        weatherBox.style.display = '';
        weatherDetails.style.display = '';
        weatherBox.classList.add('fadeIn');
        weatherDetails.classList.add('fadeIn');
        container.style.height = '590px';

        endTime = Date.now();
        console.log(`endTime is ${endTime}`);
        console.log(`Elapsed Time is ${endTime-startTime}`);

     } catch (error){
        console.error(`Error Occured: ${error}`);
        alert(`error has been occured: ${error.message}`);
    }
});
