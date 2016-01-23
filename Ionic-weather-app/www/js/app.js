// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('weatherApp', ['ionic', 'ngCordova', 'angular-skycons'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider) {

  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider

  // setup an abstract state for the tabs directive
    .state('main', {
    url: '/main',
    templateUrl: 'templates/main.html'
    })

    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('main');


})

//handles request to weather api
.controller('weatherCtrl', function( $q, $http, $cordovaGeolocation){
    var self = this;

      //function to get the day names for the next five days
      var getSelfDays = () => {

        var myDate = new Date().getDay();
        var days = ["Sun", "Mon", "Tues", "Wed", "Thurs", "Fri", "Sat"];
          var resetWeek = 0;
          var fiveDayArray =[];
          for(var count = 1; count < 6; count++){
             if (myDate+count > 6){
               fiveDayArray.push(days[resetWeek]);
               resetWeek++;
             } else {
              fiveDayArray.push(days[myDate+count]);
             }
          }

          self.nextFiveDayArray = fiveDayArray;

          console.log("next five day array ", self.nextFiveDayArray)

      }

      getSelfDays()



      //function get current city name for weather
        function getCity(lat, lng){
              //query google maps api for city name from the lat and lng
                  $q(function(resolve, reject) {
                  //gets current city data
                  $http.get("http://maps.googleapis.com/maps/api/geocode/json?latlng="+lat+","+lng)
                    .success(
                      function(cityResponse) {
                        resolve(cityResponse);

                      }, function(error) {
                        console.log("there was an error");
                        reject(error);
                      }
                    );
                  }).then(function(returnCityData){
                      self.cityState = returnCityData.results[0].formatted_address.split(",").splice(1).join(", ");
                  })
        }


     //enter zip or city name
          self.switchZip = function($event, zipInput){
            if($event.keyCode === 13){

              //take zip and get lat and lng from google maps api
                 $q(function(resolve, reject) {
                  $http.get('http://maps.googleapis.com/maps/api/geocode/json?address='+zipInput+'&country=us')
                  .success(
                    function(addressResponse) {
                      resolve(addressResponse);

                    }, function(error) {
                      reject(error);
                    }
                  );

                  //promise resolves address
                }).then(function(zipAddress){
                  console.log("zipAddress", zipAddress.results[0].geometry.location);

                  var newLat = zipAddress.results[0].geometry.location.lat;
                  var newLng = zipAddress.results[0].geometry.location.lng;

                    //get current city and set to self.cityState
                    getCity(newLat, newLng);

                    $q(function(resolve, reject) {
                //gets current weather data from forcast.io api
              $http.get('/api/forecast/deddf761abe49ca199f649859b49fc32/'+newLat+','+newLng)
                .success(
                  function(weatherResponse) {
                    resolve(weatherResponse);

                  }, function(error) {
                    console.log("there was an error");
                    reject(error);
                  }
                );
              }).then(function(weather){
                 console.log(" weather ", weather);

                //Holds a summary of week Forcast
                self.longSummary = weather.daily.summary;

                //Holds current temperature returned from API
                self.temp = Math.round(weather.currently.temperature)+"°";

                //Holds a description of weather returned from  API
                self.weatherDesc = weather.currently.summary;

                //Holds current weather icon from API
                self.CurrentWeather = {
                    forecast: {
                        icon: weather.currently.icon,
                        iconSize: 150,
                        color: self.color
                    }
                };

                //Holds what current temp feels like
                self.feelsLike = "Feels like "+Math.round(weather.currently.apparentTemperature)+"°";

               //Loop through first five days of forcast returned from API and push to self.fiveDayForcast array
               self.fiveDayForcast = []
               for(var i = 1; i < 6; i++){

                  //round max temperature to nearest degree
                  weather.daily.data[i].temperatureMax = Math.round(weather.daily.data[i].temperatureMax);

                  //round min temperature to nearest degree
                  weather.daily.data[i].temperatureMin = Math.round(weather.daily.data[i].temperatureMin);
                    self.fiveDayForcast.push(weather.daily.data[i])
               };
               console.log("self.fiveDayForcast", self.fiveDayForcast);
              })
                });
            }
      }

      //Main functionality, runs immediately
          var posOptions = {timeout: 10000, enableHighAccuracy: false};
          $cordovaGeolocation
            .getCurrentPosition(posOptions)
            .then(function (position) {
            //gets lat and lng
              var lat  = position.coords.latitude
              var lng = position.coords.longitude
              console.log("position", position)

              //get current city and set to self.cityState
              getCity(lat, lng);



              //query the forcast api by lat and lng
              $q(function(resolve, reject) {
                //gets current weather data
              $http.get('/api/forecast/deddf761abe49ca199f649859b49fc32/'+lat+','+lng)
                .success(
                  function(weatherResponse) {
                    resolve(weatherResponse);

                  }, function(error) {
                    console.log("there was an error");
                    reject(error);
                  }
                );
              }).then(function(weather){

                console.log(" weather ", weather);

                //Holds a summary of week Forcast
                self.longSummary = weather.daily.summary;

                //Holds current temperature returned from API
                self.temp = Math.round(weather.currently.temperature)+"°";

                //Holds a description of weather returned from  API
                self.weatherDesc = weather.currently.summary;

                //Holds current weather icon from API
                self.CurrentWeather = {
                    forecast: {
                        icon: weather.currently.icon,
                        iconSize: 150,
                        color: self.color
                    }
                };

                //Holds what current temp feels like
                self.feelsLike = "Feels like "+Math.round(weather.currently.apparentTemperature)+"°";

               //Loop through first five days of forcast returned from API and push to self.fiveDayForcast array
               self.fiveDayForcast = []
               for(var i = 1; i < 6; i++){

                  //round max temperature to nearest degree
                  weather.daily.data[i].temperatureMax = Math.round(weather.daily.data[i].temperatureMax);

                  //round min temperature to nearest degree
                  weather.daily.data[i].temperatureMin = Math.round(weather.daily.data[i].temperatureMin);
                    self.fiveDayForcast.push(weather.daily.data[i])
               };
               console.log("self.fiveDayForcast", self.fiveDayForcast);

              });

                }, function(err) {
                  console.log("there was an error");
                  // error
                });


});
