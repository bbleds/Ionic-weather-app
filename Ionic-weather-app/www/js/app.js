// Ionic Starter App 

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('weatherApp', ['ionic', 'ngCordova', 'angular-skycons'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

      // Don't remove this line unless you know what you are doing. It stops the viewport
      // from snapping when text inputs are focused. Ionic handles this internally for
      // a much nicer keyboard experience.
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

    self.color = "blue";

           var posOptions = {timeout: 10000, enableHighAccuracy: false};
          $cordovaGeolocation
            .getCurrentPosition(posOptions)
            .then(function (position) {
            //gets lat and lng
              var lat  = position.coords.latitude
              var lng = position.coords.longitude
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


                //enter zip


});
