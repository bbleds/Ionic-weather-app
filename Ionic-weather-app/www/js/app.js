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

    //main function
    function getWeather(url){
       $q(function(resolve, reject) {
                //gets current weather data
              $http.get(url)
                .success(
                  function(weatherResponse) {
                    resolve(weatherResponse);

                  }, function(error) {
                    console.log("there was an error");
                    reject(error);
                  }
                );
              }).then(function(weather){
                  //get lat and long
                  self.feels = Math.round(weather.current_observation.temp_f);
                  self.cityName = weather.location.city +", "+ weather.location.state;
                  //personal weather station id
                  self.station = weather.current_observation.station_id;
                  //get search history
                  var searchHistory = JSON.parse(localStorage.getItem('searchHistory')) || {};
                  //set key
                  searchHistory[self.cityName] = self.station;
                  //add to local storage
                  localStorage.searchHistory = JSON.stringify(searchHistory);

                  //outputtodom
                  self.searchOutput = searchHistory;
                  
                

              });

    }

        //******** AUTO IP CALL **********//
               //query the weather underground api by lat and lng to get auto ip first, then html 5 location 
              getWeather('http://api.wunderground.com/api/2f0c8e826c308010/conditions/forecast/geolookup/q/autoip.json');

    //******** HTML 5 CALL **********//
               $q(function(resolve, reject) {
                        //gets current weather data
                         navigator.geolocation.getCurrentPosition(function(data){                           

                           resolve(data);
                        });
                  
                      }).then(function(data){
                          //get lat and long
                        console.log("data ", data);
                        var lat = data.coords.latitude;
                        var lng = data.coords.longitude;
                        console.log("latitude ", lat);
                        console.log("longitude", lng);
                        getWeather('http://api.wunderground.com/api/2f0c8e826c308010/geolookup/conditions/forecast/q/'+lat+','+lng+'.json');
                        self.gotGeo = true;
                      });

                self.searchForZip = function($event, newZip){

                  if($event.keyCode === 13 && self.gotGeo === true){
                      console.log("newZip ", newZip);
                       getWeather('http://api.wunderground.com/api/2f0c8e826c308010/geolookup/conditions/forecast/q/'+newZip+'.json');
            
                  }
                      
                }

              //get a search box before lunch that searches by zip


      


});
