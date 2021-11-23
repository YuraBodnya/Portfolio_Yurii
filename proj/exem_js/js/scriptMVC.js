
class Controller{
  constructor(view , model){
    this.model = model;
    this.view = view;
  }
  init(){
    this.model.currentGeolocation()
        .then(data => {
            this.model.location.lat = data.lat;
            this.model.location.lon = data.lon;
            this.model.location.optionSearch = data.optionSearch;})
        .catch(error => this.view.showErrorBlock(error));
  }
}

class Model{
    constructor(){
        this.location = {
            lat: '',
            lon: '',
            optionSearch: true
        };
        this.url = [
                'http://api.openweathermap.org/data/2.5/weather?q=Luhansk&units=metric&appid=dcf132fe522672ad08dcda4ab5ff268d'
        ];
        this.data = null;
    }
    
    currentGeolocation(){
      return new Promise(function(resolve , reject){
          navigator.geolocation.getCurrentPosition(function(pos){
            resolve ({
                lat: pos.coords.latitude,
                lon: pos.coords.longitude,
                optionSearch: true
           });
          },
          function(err){
              reject(new Error(err));
          },
          {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0
        }
        );
    });
    }
}

class View{
  constructor(section){
    this.section = document.querySelector(section);
  }
  showErrorBlock(){
      console.log(this);
  }
}

const view = new View('#section-weather');
const model = new Model();
const controller = new Controller(view , model).init();