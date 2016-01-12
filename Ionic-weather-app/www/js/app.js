// Ionic Starter App 

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', ['ionic', 'ngCordova', 'angular-skycons'])

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
    .state('root', {
    url: '/root',
    templateURL: 'templates/root.html'
  })

    // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('root');


})

//handles request to weather api
.controller('weatherCtrl', function($scope, $q, $http, $cordovaGeolocation){
    $scope.temp;

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

                $scope.temp = Math.round(weather.currently.temperature)+"°";

                $scope.weatherDesc = weather.currently.summary;

               $scope.CurrentWeather = {
                  forecast: {
                      icon: "partly-cloudy-night",
                      iconSize: 100,
                      color: "blue"
                  }
              };

                //set icon by -->
                // clear-day, clear-night, rain, snow, sleet, wind, fog, cloudy, partly-cloudy-day, or partly-cloudy-night
              });

                }, function(err) {
                  console.log("there was an error");
                  // error
                });


});
