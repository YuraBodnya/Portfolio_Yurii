//Exem Bodnya "Weather"
const inpCity = document.querySelector('#inp-city');
const weatherCurrent = document.querySelector('#current-weather');
const hourly = document.querySelector('#hourly');
const nearbyPlaces = document.querySelector('#nearby-places');
const currentDate = new Date();
const sectionWeather = document.querySelector('#section-weather');
const container = document.querySelector('#container');
const btnSearch = document.querySelector('#btn-search');
const img = 'img/316141-64.png';
const weatherToday = document.querySelector('#weather-today');
const weatherDay5 = document.querySelector('#weather-day5');

const options = {
  enableHighAccuracy: true,
  timeout: 5000,
  maximumAge: 0
};

window.addEventListener('load' , init);

function init(){
  navigator.geolocation.getCurrentPosition(success , error , options);
  weatherToday.addEventListener('click' , init);
  // weatherDay5.addEventListener('click' , function(){ 
  //     getFetch(`http://api.openweathermap.org/data/2.5/forecast?q=${inpCity.value}&units=metric&appid=dcf132fe522672ad08dcda4ab5ff268d`,weatherDay5SearchPrint);
  // });
  weatherDay5.addEventListener('click' , weatherDay5SearchData);
  btnSearch.addEventListener('click' , searchCityWeather);
}

// init();

async function fetchAsync(url){
  try {
      const response = await fetch(url);
      const data = await response.json();
      return data;
  } catch (error) {
    showErrorBlock();
    console.log('ошибка ' + error);
  }
}

// function getFetch(url , fn , obj){
//     fetchAsync(url)
//         .then(data => fn(data))
//         .catch(error => showErrorBlock(error));
// }
function searchCityWeather(){
  fetchAsync(`http://api.openweathermap.org/data/2.5/weather?q=${inpCity.value}&units=metric&appid=dcf132fe522672ad08dcda4ab5ff268d`)
    .then(data => checkData(data))
    .catch(error => showErrorBlock(error));
}

//вывод погоды по геолокации
function success(pos){
  const loc = pos.coords;
  fetchAsync(`http://api.openweathermap.org/data/2.5/weather?lat=${loc.latitude}&lon=${loc.longitude}&units=metric&appid=dcf132fe522672ad08dcda4ab5ff268d`)
    .then(data => checkData(data))
    .catch(error => showErrorBlock(error));  
}
//вывод погоды моего города
function error(err) {
  fetchAsync(`http://api.openweathermap.org/data/2.5/weather?q=Luhansk&units=metric&appid=dcf132fe522672ad08dcda4ab5ff268d`)
    .then(data => currentWeather(data))
    .catch(error => showErrorBlock(error));
}
//functions  Current Weather 
function checkData(data){
  if(data.cod >= 400){
    showErrorBlock();
  }
  currentWeather(data);
}

function showErrorBlock(){
  clearBlock();
  sectionWeather.classList.add('hidden');
  container.innerHTML = `
    <div class="block404">
      <img src="img/error-404-not-found-glitch-effect_8024-4.jpg">
      <p>Qerty could not be found.<br> Please enter a different location</p>
    </div>
  `;
}

function clearBlock(){
  weatherCurrent.innerHTML = '';
  nearbyPlaces.innerHTML = '';
  hourly.innerHTML = '';
  container.innerHTML = '';
}

function currentWeather(data){
  if(data.cod >= 400) return;
  clearBlock();
  sectionWeather.classList.remove('hidden');
  const newDate = formattedDate(currentDate);
  const temperature = `${Math.floor(data.main.temp)}`;
  const temperatureRealFeel = `${Math.round(data.main.feels_like)}`;
  inpCity.value = data.name;
  const contentCurrentWeather = [`
    <div class="current-weather-block">
      <h3>current weather</h3>
      ${newDate}
    </div>
    <div class="data-weather">
      <div class="icon-description">
        <img src="http://openweathermap.org/img/wn/${data.weather[0].icon}.png">
        <p>${data.weather[0].main}</p>
      </div>
      <div class="temperature-block">
        <div class="temperature">
          <h2>${temperature}</h2>
          <img src="${img}" class="fix-temperature">
        </div>
        <div class="real-feel">
          <p>Real Feel ${temperatureRealFeel}&deg</p>
        </div>
      </div>
      <div class="data-of-the-day">
        <div><p>Sunrise:</p><p>${formattedTimeAmPm(new Date(data.sys.sunrise*1000))}</p></div>
        <div><p>Sunset:</p><p>${formattedTimeAmPm(new Date(data.sys.sunset*1000))}</p></div>
        <div><p>Duration:</p> <p>${lengthOfDay(data.sys.sunrise,data.sys.sunset)}</p></div>
      </div>
    </div>
  `];
  weatherCurrent.innerHTML = contentCurrentWeather.join('');
  hourlyDay(data);
}

function hourlyDay(data){
  fetchAsync(`https://api.openweathermap.org/data/2.5/onecall?lat=${data.coord.lat}&lon=${data.coord.lon}&units=metric&appid=dcf132fe522672ad08dcda4ab5ff268d`)
    .then(data => hourlyDayPrint(data))
    .catch(error => showErrorBlock(error));
}

function hourlyDayPrint(data){
  const contentHourlyDay = [];
  for(let i = 0 ; i < 6;i++){
    const temperature = `${Math.floor(data.hourly[i].temp)}`;
    const temperatureRealFeel = `${Math.round(data.hourly[i].feels_like)}`;
    contentHourlyDay.push(`
      <div class="hour-day">
        <p>${formattedTime(data.hourly[i].dt * 1000)}</p>
        <img src="http://openweathermap.org/img/wn/${data.hourly[i].weather[0].icon}.png">
        <p>${data.hourly[i].weather[0].main}</p>
        <p>${temperature}&deg</p>
        <p>${temperatureRealFeel}&deg</p>
        <p>${wind(data.hourly[i].wind_speed, data.hourly[i].wind_deg)}</p>
      </div>
    `);
  }
  hourly.innerHTML = `
  <div class="current-hourly-Day-block">
    <h3>Hourly</h3>
  </div>
  <div class="content-hourly-day">
      <div class="description-hourly-day">
        <p>Today</p>
        <p>Forecast</p>
        <p>Temp (&degC)</p>
        <p>RealFeel</p>
        <p>Wind (km/h)</p>
      </div>
      ${contentHourlyDay.join('')}
  </div>
  `;
  nearbyPlacesSearch(data);
}

function nearbyPlacesSearch(data){
  fetchAsync(`https://api.openweathermap.org/data/2.5/find?lat=${data.lat}&lon=${data.lon}&cnt=6&units=metric&appid=dcf132fe522672ad08dcda4ab5ff268d`)
    .then(data => nearbyPlacesPrint(data))
    .catch(error => showErrorBlock(error));
}

function nearbyPlacesPrint(data){
  const content = [];
  for(let i = 2; i < data.list.length;i++){
    content.push(`
    <div>
      <p>${data.list[i].name}</p>
      <div class="icon-temp">
        <img src="http://openweathermap.org/img/wn/${data.list[i].weather[0].icon}.png">
        <p>${Math.round(data.list[i].main.temp)}&degC</p>
      </div>
    </div>
    `);
  }
  nearbyPlaces.innerHTML =`
  <div class="nearby-places-block">
    <h3>nearby places</h3>
  </div>
  <div class="nearby-places">
    ${content.join('')}
  </div>
  `;
}

//functions Weather 5 Day
// getFetch(`http://api.openweathermap.org/data/2.5/forecast?q=${inpCity.value}&units=metric&appid=dcf132fe522672ad08dcda4ab5ff268d`,weatherDay5SearchPrint);
function weatherDay5SearchData(){
  fetchAsync(`http://api.openweathermap.org/data/2.5/forecast?q=${inpCity.value}&units=metric&appid=dcf132fe522672ad08dcda4ab5ff268d`)
    .then(data => weatherDay5SearchPrint(data))
    .catch(error => showErrorBlock(error));
}

function weatherDay5SearchPrint(data){
  clearBlock();
  const content = [];
  const api = data.list;
  for(let i = 0; i < 40; i= i + 8){
    const temperature = `${Math.floor(api[i].main.temp)}`;
    content.push(`
      <div class="days" data-day="${api[i].dt_txt}">
        <h2>${dayOfWeek(api[i].dt_txt)}</h2>
        <p>${dateToYMD(api[i].dt_txt)}</p>
        <img src="http://openweathermap.org/img/wn/${api[i].weather[0].icon}.png " class="img">
        <p class="temp-5day">${temperature}&degC</p>
        <p>${api[i].weather[0].main}</p>
      </div>
    `);
  }
  weatherCurrent.innerHTML = `
    <div class="days-of-week">
      ${content.join('')}
    </div>
  `;
  const daysOfWeek = document.querySelector('.days-of-week');
  const addActivBlock = document.querySelectorAll('.days');
  addActivBlock[0].classList.add('active-block');
  printHourlyTemperature(api , 0);
  daysOfWeek.addEventListener('click' , (e)=>{
    if(e.target.closest('.days')){

      const days = document.querySelectorAll('.days');
      days.forEach(element => {
        element.classList.remove('active-block');
      });
      e.target.closest('.days').classList.add('active-block');

      const dateDayWeek = new Date(e.target.closest('.days').dataset.day);
      for(let index = 0; index < api.length; index++){
        const dateSearchIndex = new Date(api[index].dt_txt);
        if(dateDayWeek.getDay() == dateSearchIndex.getDay()){
          printHourlyTemperature(api , index);
          break;
        }
      }
    }
  });
}

function printHourlyTemperature(api , index){
  hourly.innerHTML = '';
  const contentHourlyDay = [];
  for(let i = index ; i < index + 6;i++){
    const temperature = api[i].main.temp;
    const temperatureRealFeel = `${Math.round(api[i].main.feels_like)}`;
    contentHourlyDay.push(`
      <div class="hour-day">
        <p>${formattedTime(api[i].dt_txt)}</p>
        <img src="http://openweathermap.org/img/wn/${api[i].weather[0].icon}.png">
        <p>${api[i].weather[0].main}</p>
        <p>${temperature}&deg</p>
        <p>${temperatureRealFeel}&deg</p>
        <p>${wind(api[i].wind.speed, api[i].wind.deg)}</p>
      </div>
    `);
  }
  hourly.innerHTML = `
  <div class="current-hourly-Day-block">
    <h3>Hourly</h3>
  </div>
  <div class="content-hourly-day">
      <div class="description-hourly-day">
        <p>Today</p>
        <p>Forecast</p>
        <p>Temp (&degC)</p>
        <p>RealFeel</p>
        <p>Wind (km/h)</p>
      </div>
      ${contentHourlyDay.join('')}
  </div>
  `;
}

//function wind
function wind(speed,dg){
  const fixSpeed = `${Math.round(speed * 3.6)}`;
  let str = '';
  if(dg == 360 ) str = `${fixSpeed} N`;
  if(dg >= 0 && dg < 90) str = `${fixSpeed} NE`;
  if(dg == 90 ) str = `${fixSpeed} E`;
  if(dg >= 91 && dg < 180) str = `${fixSpeed} SE`;
  if(dg == 180 ) str = `${fixSpeed} S`;
  if(dg >= 181 && dg < 270 ) str = `${fixSpeed} SW`;
  if(dg == 270 ) str = `${fixSpeed} W`;
  if(dg >= 271 && dg < 360 ) str = `${fixSpeed} NW`;
  return str;
}

//function Date and Time
function lengthOfDay(sunriseDay , sunsetDay){
  const sunrise = new Date(sunriseDay * 1000);
  const sunset = new Date(sunsetDay * 1000);
  const hour = Math.floor((Date.parse(sunset) - Date.parse(sunrise))/1000/60/60);
  const minute = Math.round((Date.parse(sunset) - Date.parse(sunrise))/1000/60 - hour * 60);
  return `${hour}:${minute} hr`;
}

function formattedTimeAmPm(sunriseSunset){
  const sunsetSunsetDay = sunriseSunset.toLocaleString([], { hour12: true,hour: 'numeric', minute: '2-digit'});
  return sunsetSunsetDay;
}

function formattedDate(date) {
  let month = String(date.getMonth() + 1);
  let day = String(date.getDate());
  const year = String(date.getFullYear());
  if (month.length < 2) month = '0' + month;
  if (day.length < 2) day = '0' + day;
  return `${day}.${month}.${year}`;
}
function formattedTime(data){
  const time = new Date(data);
  return formatAMPM(time);
}

function formatAMPM(date) {
  let hours = date.getHours();
  const ampm = hours >= 12 ? 'pm' : 'am';
  hours = hours % 12;
  hours = hours ? hours : 12;
  const strTime = hours + ' ' + ampm;
  return strTime;
}

function dayOfWeek(date){
  const day = new Date(date);
  const days = ['Sun', 'Mon', 'Tues', 'Wed', 'Thurs', 'Fri', 'Sat'];
  return days[day.getDay()];
}

function dateToYMD(date) {
  const day = new Date(date);
  const strArray=['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
  const d = day.getDate();
  const m = strArray[day.getMonth()];
  return m + ' ' + (d <= 9 ? '0' + d : d);
}



