const apiKey = 'YOUR-API-KEY';
const btn = document.getElementById('get-location');
const status = document.getElementById('status');
const display = document.getElementById('weather-display');

btn.addEventListener('click', () => {
    status.innerText = 'LOCATING...';
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                const { latitude, longitude } = pos.coords;
                fetchWeather(latitude, longitude);
            },
            (err) => {
                status.innerText = 'ERROR';
                document.getElementById('error-msg').innerText = err.message;
            }
        );
    }
});

async function fetchWeather(lat, lon) {
    status.innerText = 'FETCHING...';
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;
    
    try {
        const response = await fetch(url);
        
        
        if (!response.ok) {
            const errorData = await response.json();
            console.error("API Error:", errorData);
            status.innerText = `ERR: ${response.status}`;
            return;
        }

        const data = await response.json();
        displayData(data);
        status.innerText = 'STABLE';
    } catch (err) {
        console.error("Network/CORS Error:", err);
        status.innerText = 'OFFLINE';
    }
}
function displayData(data) {
    document.getElementById('temp').innerText = `${Math.round(data.main.temp)}°`;
    document.getElementById('city').innerText = data.name;
    document.getElementById('description').innerText = data.weather[0].description;
    document.getElementById('humidity').innerText = data.main.humidity;
    document.getElementById('wind').innerText = data.wind.speed;
    
    display.classList.remove('hidden');

    // Dynamic UI logic
    const body = document.body;
    const icon = data.weather[0].icon; 

    if (icon.includes('n')) {
        // Night Mode: Deep Black / Charcoal
        body.style.setProperty('--bg', '#050505');
        body.style.setProperty('--fg', '#ffffff');
        body.style.setProperty('--accent', '#444');
    } else {
        // Day Mode: Paper White / Light Gray
        body.style.setProperty('--bg', '#f2f2f2');
        body.style.setProperty('--fg', '#000000');
        body.style.setProperty('--accent', '#888');
    }

    display.classList.remove('hidden');
}
