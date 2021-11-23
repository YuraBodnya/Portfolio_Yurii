

//Exem Bodnya Weather last v


class Weather{
    constructor(section){
        this.section = document.querySelector(section);
        this.searchInput = document.querySelector('#inp-city');
        this.linkToday = document.querySelector('#weather-today');
        this.link5Day = document.querySelector('#weather-day5');
        this.btnSearch = document.querySelector('#btn-search');
        this.geoOption = {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0
        };
        this.location = {
            lat: '',
            lon: ''
        };
        this.url = [
            'http://api.openweathermap.org/data/2.5/weather?q=Luhansk&units=metric&appid=dcf132fe522672ad08dcda4ab5ff268d'
        ];
        this.currentDate = this.formattedDate(new Date());
        this.content = [];
    }
    init(){
        this.currentGeolocation();
        this.linkToday.addEventListener('click' , this.currentGeolocation.bind(this));
        this.btnSearch.addEventListener('click' , this.searchCityWeather.bind(this));
        this.link5Day.addEventListener('click' , this.searchData.bind(this));
        window.addEventListener('keydown' , this.search.bind(this));
    }
    getUrl(parUrl){
        let url;
        if(parUrl == 'city') url = 'http://api.openweathermap.org/data/2.5/weather?q=Luhansk&units=metric&appid=dcf132fe522672ad08dcda4ab5ff268d';
        if(parUrl == 'inp') url = `http://api.openweathermap.org/data/2.5/weather?q=${this.searchInput.value}&units=metric&appid=dcf132fe522672ad08dcda4ab5ff268d`;
        if(parUrl == 'weatherLoc') url = `http://api.openweathermap.org/data/2.5/weather?lat=${this.location.lat}&lon=${this.location.lon}&units=metric&appid=dcf132fe522672ad08dcda4ab5ff268d`;
        if(parUrl == 'onecall') url = `https://api.openweathermap.org/data/2.5/onecall?lat=${this.location.lat}&lon=${this.location.lon}&units=metric&appid=dcf132fe522672ad08dcda4ab5ff268d`;
        if(parUrl == 'findLoc') url = `https://api.openweathermap.org/data/2.5/find?lat=${this.location.lat}&lon=${this.location.lon}&cnt=6&units=metric&appid=dcf132fe522672ad08dcda4ab5ff268d`;
        if(parUrl == 'forecast') url = `http://api.openweathermap.org/data/2.5/forecast?q=${this.searchInput.value}&units=metric&appid=dcf132fe522672ad08dcda4ab5ff268d`;
        return url;
    }
    async fetchAsync(url){
        try {
            const response = await fetch(url);
            const data = await response.json();
            return data;
        } catch (error) {
            console.log('ошибка ' + error);
        }
    }
    getFetchApi(url , fn){
        this.fetchAsync(url)
            .then(data => fn(data))
            .catch(error => this.showErrorBlock(error));
    }
    currentGeolocation(){
        navigator.geolocation.getCurrentPosition(this.success.bind(this) , this.errorLocation.bind(this) , this.options);
    }
    checkData(data){
        if(data.cod >= 400){
          this.showErrorBlock();
        }
        this.currentWeather(data);
    }
    errorLocation(err){
        console.warn(`ERROR(${err.code}): ${err.message}`);
        this.getFetchApi(this.getUrl('city') , this.currentWeather.bind(this));
    }
    search(e){
        if(e.code == 'Enter') this.searchCityWeather();
    }
    success(pos){
        this.location = {
            lat:pos.coords.latitude,
            lon:pos.coords.longitude
        };
        this.getFetchApi(this.getUrl('weatherLoc') , this.currentWeather.bind(this));
    }
    currentWeather(data){
        if(data.cod >= 400) return;
        this.section.classList.remove('hidden2');
        this.searchInput.value = data.name;
        this.content = [`
            <div class="current-weather-block">
                <div id="current-weather-block">
                    <h3>current weather</h3>
                    ${this.currentDate}
                </div>
                <div class="data-weather">
                <div class="icon-description">
                    <img src="http://openweathermap.org/img/wn/${data.weather[0].icon}.png">
                    <p>${data.weather[0].main}</p>
                </div>
                <div class="temperature-block">
                    <div class="temperature">
                    <h2>${this.formattetTemp(data.main.temp , 'f')}&degC</h2>
                    
                    </div>
                    <div class="real-feel">
                    <p>Real Feel ${this.formattetTemp(data.main.temp , 'r')}&deg</p>
                    </div>
                </div>
                <div class="data-of-the-day">
                    <div><p>Sunrise:</p><p>${this.timeAmPm(new Date(data.sys.sunrise*1000))}</p></div>
                    <div><p>Sunset:</p><p>${this.timeAmPm(new Date(data.sys.sunset*1000))}</p></div>
                    <div><p>Duration:</p><p>${this.lengthOfDay(data.sys.sunrise,data.sys.sunset)}</p></div>
                </div>
             </div>
            </div>
               
        `];
        this.section.innerHTML = this.content.join('');
        this.HourlyDay(data);
    }
    HourlyDay(data){
        this.location = {
            lat:data.coord.lat,
            lon:data.coord.lon
        };
        this.getFetchApi(this.getUrl('onecall') , this.printHourlyDay.bind(this));
    }
    printHourlyDay(data){
        this.content = [];
        for(let i = 0 ; i < 6;i++){
            this.content.push(`
            <div class="hour-day">
                <p>${this.formattedTime(data.hourly[i].dt * 1000)}</p>
                <img src="http://openweathermap.org/img/wn/${data.hourly[i].weather[0].icon}.png">
                <p>${data.hourly[i].weather[0].main}</p>
                <p>${this.formattetTemp(data.hourly[i].temp , 'f')}&deg</p>
                <p>${this.formattetTemp(data.hourly[i].feels_like , 'r')}&deg</p>
                <p>${this.wind(data.hourly[i].wind_speed, data.hourly[i].wind_deg)}</p>
            </div>
            `);
        }
        const el = this.createItem('div' , 'hourly' , this.section );
        el.innerHTML = `
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
            ${this.content.join('')}
        </div>
        `;
        this.nearbyPlacesSearch();
    }
    nearbyPlacesSearch(){
        this.getFetchApi(this.getUrl('findLoc') , this.printNearbyPlaces.bind(this));
    }
    printNearbyPlaces(data){
        this.content = [];
        for(let i = 2; i < data.list.length;i++){
            this.content.push(`
            <div>
            <p>${data.list[i].name}</p>
            <div class="icon-temp">
                <img src="http://openweathermap.org/img/wn/${data.list[i].weather[0].icon}.png">
                <p>${Math.round(data.list[i].main.temp)}&degC</p>
            </div>
            </div>
            `);
        }
        const el =this.createItem('div','nearby-placess',this.section);
        el.innerHTML =`
        <div class="nearby-places-block">
            <h3>nearby places</h3>
        </div>
        <div class="nearby-places">
            ${this.content.join('')}
        </div>
        `;
    }
    searchCityWeather(){
        this.getFetchApi(this.getUrl('inp') , this.checkData.bind(this));
    }
    searchData(){
        this.getFetchApi( this.getUrl('forecast') , this.printData.bind(this));
    }
    printData(data){
        this.content = [];
        const api = data.list;
        for(let i = 0; i < 40; i= i + 8){
            this.content.push(`
                <div class="days" data-day="${api[i].dt_txt}">
                    <h2>${this.dayOfWeek(api[i].dt_txt)}</h2>
                    <p>${this.dateToYMD(api[i].dt_txt)}</p>
                    <img src="http://openweathermap.org/img/wn/${api[i].weather[0].icon}.png " class="img">
                    <p class="temp-5day">${this.formattetTemp(api[i].main.temp, 'f')}&degC</p>
                    <p>${api[i].weather[0].main}</p>
                </div>
            `);
        }
        this.section.innerHTML = '';
        let el = this.createItem('div' , 'days-of-week' , this.section);
        el.innerHTML = this.content.join('');
        this.preparationBlocks(api);
    }
    preparationBlocks(api){
        const daysOfWeek = document.querySelector('.days-of-week');
        const block = document.querySelectorAll('.days');
        block[0].classList.add('active-block');
        daysOfWeek.addEventListener('click' , (e)=>{
            if(e.target.closest('.days')){
                block.forEach(element => {
                element.classList.remove('active-block');
              });
              e.target.closest('.days').classList.add('active-block');
              const dateDayWeek = new Date(e.target.closest('.days').dataset.day);
              for(let index = 0; index < api.length; index++){
                const dateSearchIndex = new Date(api[index].dt_txt);
                if(dateDayWeek.getDay() == dateSearchIndex.getDay()){
                  this.printHourly(api , index);
                  break;
                }
              }
            }
          });
        const el = this.createItem('div' , 'hourly' , this.section);
        this.printHourly(api , 0);
    }
    printHourly(api , index){
        const el = document.querySelector('.hourly');
        el.innerHTML = '';
        this.content = [];
        for(let i = index ; i < index + 6;i++){
          this.content.push(`
            <div class="hour-day">
              <p>${this.formattedTime(api[i].dt_txt)}</p>
              <img src="http://openweathermap.org/img/wn/${api[i].weather[0].icon}.png">
              <p>${api[i].weather[0].main}</p>
              <p>${this.formattetTemp(api[i].main.temp , 'f')}&deg</p>
              <p>${this.formattetTemp(api[i].main.feels_like, 'r')}&deg</p>
              <p>${this.wind(api[i].wind.speed, api[i].wind.deg)}</p>
            </div>
          `);
        }
        el.innerHTML = `
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
            ${this.content.join('')}
        </div>
        `;
    }
    showErrorBlock(){
        this.section.innerHTML = `
            <div class="block404">
                <img src="img/404test.png">
                <p>Qerty could not be found.<br> Please enter a different location</p>
            </div>
        `;
    }
    createItem(tag , className , parent){
        const el = document.createElement(tag);
        el.classList.add(className);
        parent.append(el);
        return el;
    }
    dayOfWeek(date){
        const day = new Date(date);
        const days = ['Sun', 'Mon', 'Tues', 'Wed', 'Thurs', 'Fri', 'Sat'];
        return days[day.getDay()];
    }
    dateToYMD(date) {
        const day = new Date(date);
        const strArray=['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
        const d = day.getDate();
        const m = strArray[day.getMonth()];
        return m + ' ' + (d <= 9 ? '0' + d : d);
    }
    wind(speed,dg){
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
    formattedTime(data){
        const dateNew = new Date(data);
        return this.formatAMPM(dateNew);
    }
    formatAMPM(date) {
        let hours = date.getHours();
        const ampm = hours >= 12 ? 'pm' : 'am';
        hours = hours % 12;
        hours = hours ? hours : 12;
        const strTime = hours + ' ' + ampm;
        return strTime;
    }
    lengthOfDay(sunriseDay , sunsetDay){
        const sunrise = new Date(sunriseDay * 1000);
        const sunset = new Date(sunsetDay * 1000);
        const hour = Math.floor((Date.parse(sunset) - Date.parse(sunrise))/1000/60/60);
        const minute = Math.round((Date.parse(sunset) - Date.parse(sunrise))/1000/60 - hour * 60);
        return `${hour}:${minute} hr`;
    }
    timeAmPm(sunriseSunset){
        const sunsetSunsetDay = sunriseSunset.toLocaleString([], { hour12: true,hour: 'numeric', minute: '2-digit'});
        return sunsetSunsetDay;
    }
    formattedDate(date){
        let month = String(date.getMonth() + 1);
        let day = String(date.getDate());
        const year = String(date.getFullYear());
        if (month.length < 2) month = '0' + month;
        if (day.length < 2) day = '0' + day;
        return `${day}.${month}.${year}`;
    }
    formattetTemp(data , formattet){
        let temp = null;
        if(formattet == 'f') temp = Math.floor(data);
        if(formattet == 'r') temp = Math.round(data);   
        return temp;
    }

}
const weather = new Weather('#section-weather').init();
