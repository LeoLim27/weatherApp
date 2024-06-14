import {api} from './api.js';

const container = document.querySelector('.container');
const search = document.querySelector('.search-box button');
const weatherBox = document.querySelector('.weather-box');
const weatherDetails = document.querySelector('.weather-details');
const error404 = document.querySelector('.not-found');

// call needed info by 'click' button. need to add 'Enter' as well.
search.addEventListener('click', () => {
    const APIKey = api;
    const city = document.querySelector('.search-box input').value;
    if (city === '') {
        console.log(`City is empty`);
        return;
    }
    // need to pares the longitude and latitude to get weather info
    // first fetch the longitude and latitude of the city by using geo API 
    console.log(`Fetching data for a city: ${city}`);
    fetch (`http://api.openweathermap.org/geo/1.0/direct?q=${city}&appid=${APIKey}`)
        .then(response => {
            console.log(`Geo API response:`, response);
            return response.json();
        })
        .then(json => {
            console.log('Geo API data:', json);
            const lat = json[0].lat;
            const lon = json[0].lon;
            // opeenWeather 'current weather data' API call
            return fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${APIKey}`);

        })
        .then(response => {
            console.log('Weather API response:', response);
            return response.json();
        })
        .then(json => {
            console.log('Weather API data', json);
            // location not found is not working currently
            if (json.cod === '404') {
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

            switch (json.weather[0].main) {
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

            temperature.innerHTML = `${Math.round((parseInt(json.main.temp)-273.15)*10)/10}<span> °C</span>`;
            description.innerHTML = `${json.weather[0].description}`;
            humidity.innerHTML = `${json.main.humidity}%`;
            wind.innerHTML = `${parseInt(json.wind.speed)}Km/h`;

            weatherBox.style.display = '';
            weatherDetails.style.display = '';
            weatherBox.classList.add('fadeIn');
            weatherDetails.classList.add('fadeIn');
            container.style.height = '590px';
     });
});
