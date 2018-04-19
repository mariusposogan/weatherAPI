/* global localStorage*/
$(onHtmlLoaded);

function onHtmlLoaded() { 
    const cookies = getCookiesAsObject();
    const preferredTemperature = storageAvailable("localStorage") ? 
    localStorage.getItem("temperature") : cookies.temperature;
    
    getWeather(preferredTemperature);
    
    const radios = document.getElementsByName("temperature");
    radios.forEach(function(radio) {
        if (radio.value === preferredTemperature) {
            radio.checked = "checked";
        }
        
        radio.addEventListener("click", function() {
            if (storageAvailable("localStorage")) {
                localStorage.setItem("temperature", this.value);
                getWeather();
            }
            else {
                 document.cookie = "temperature=" + this.value;
            }
        });
    });
    
}  

function getWeather(preferredTemperature) {
    $.ajax({
        url:  'https://api.wunderground.com/api/cfbfc5f603141e07/conditions/q/RO/Cluj_Napoca.json',
        method: 'GET',
        success: function(response) { 
            var temperatureElement = document.getElementById("temperature");
            const temperatureC = response.current_observation.temp_c;
            const temperatureF = response.current_observation.temp_f;
            const feelsLikeC = response.current_observation.feelslike_c;
            const feelsLikeF = response.current_observation.feelslike_f;
            
            if ( (localStorage.temperature === "C") || (preferredTemperature === localStorage)){
                temperatureElement.innerHTML = 
                    "Cluj-Napoca: " + temperatureC + " but it feels like " + feelsLikeC;
            } else {
                temperatureElement.innerHTML = 
                    "Cluj-Napoca: " + temperatureF + " but it feels like " + feelsLikeF;
            }                            
            
            $("#temperature").css({
               "margin": "10px",
               "padding": "0 5px 25px"
            });
        }
    });
}

function storageAvailable(type) {
    try {
        var storage = window[type],
            x = '__storage_test__';
        storage.setItem(x, x);
        storage.removeItem(x);
        return true;
    }
    catch(e) {
        return e instanceof DOMException && (
            // everything except Firefox
            e.code === 22 ||
            // Firefox
            e.code === 1014 ||
            // test name field too, because code might not be present
            // everything except Firefox
            e.name === 'QuotaExceededError' ||
            // Firefox
            e.name === 'NS_ERROR_DOM_QUOTA_REACHED') &&
            // acknowledge QuotaExceededError only if there's something already stored
            storage.length !== 0;
    }
}

function getCookiesAsObject() {
    const cookiesString = document.cookie;
    const cookiesArray = cookiesString.split("; ");
    
    const cookies = {};
    cookiesArray.forEach(function(c) {
        const cookie = c.split("=");
        console.log(cookie);
        const key = cookie[0]; 
        const value = cookie[1]; 
        cookies[key] = value;
        getWeather(cookie[1]);
    });
    
    return cookies;
}