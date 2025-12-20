const apiKey = 'YOUR-API-KEY';
const btn = document.getElementById('get-location');
const unitBtn = document.getElementById('unit-toggle');
const status = document.getElementById('status');
const display = document.getElementById('weather-display');
const cityDisplay = document.getElementById('city');
const citySearch = document.getElementById('city-search');
let currentUnit = 'metric';
let lastQuery = null; 

// 1. UNIT TOGGLE
unitBtn.addEventListener('click', () => {
    currentUnit = currentUnit === 'metric' ? 'imperial' : 'metric';
    unitBtn.innerText = currentUnit === 'metric' ? '°C' : '°F';
    
    // If there is active data on screen, refresh it with the new unit
    if (lastQuery) {
        lastQuery.type === 'geo' 
            ? fetchWeather(lastQuery.lat, lastQuery.lon) 
            : fetchWeatherByCity(lastQuery.city);
    }
});

// 2. SEARCH LOGIC
cityDisplay.addEventListener('click', () => {
    cityDisplay.classList.add('hidden');
    citySearch.classList.remove('hidden');
    citySearch.focus();
});

citySearch.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        const city = citySearch.value.trim();
        if (city) fetchWeatherByCity(city);
        citySearch.classList.add('hidden');
        cityDisplay.classList.remove('hidden');
        citySearch.value = '';
    }
});

// 3. LOCATION SYNC
btn.addEventListener('click', () => {
    status.innerText = 'LOCATING...';
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                const { latitude, longitude } = pos.coords;
                lastQuery = { type: 'geo', lat: latitude, lon: longitude };
                fetchWeather(latitude, longitude);
            },
            (err) => { status.innerText = 'ERR: LOC'; }
        );
    }
});

async function fetchWeather(lat, lon) {
    status.innerText = 'FETCHING...';
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=${currentUnit}&appid=${apiKey}`;
    performFetch(url);
}

async function fetchWeatherByCity(city) {
    status.innerText = 'SEARCHING...';
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=${currentUnit}&appid=${apiKey}`;
    lastQuery = { type: 'city', city: city };
    performFetch(url);
}

async function performFetch(url) {
    try {
        const response = await fetch(url);
        const data = await response.json();
        if (data.cod !== 200) throw new Error();
        
        displayData(data);
        status.innerText = 'STABLE';
    } catch (err) {
        status.innerText = 'NOT FOUND';
    }
}

function displayData(data) {
    document.getElementById('temp').innerText = `${Math.round(data.main.temp)}°`;
    document.getElementById('city').innerText = data.name;
    document.getElementById('description').innerText = data.weather[0].description;
    document.getElementById('humidity').innerText = data.main.humidity;
    document.getElementById('wind').innerText = data.wind.speed;
    document.getElementById('wind-unit').innerText = currentUnit === 'metric' ? 'KM/H' : 'MPH';
    
    // Theme logic
    const body = document.body;
    if (data.weather[0].icon.includes('n')) {
        body.style.setProperty('--bg', '#050505');
        body.style.setProperty('--fg', '#ffffff');
    } else {
        body.style.setProperty('--bg', '#f2f2f2');
        body.style.setProperty('--fg', '#000000');
    }

    // Smooth fade in
    display.classList.remove('hidden');
    display.style.opacity = "0";
    requestAnimationFrame(() => {
        display.style.opacity = "1";
    });
}
