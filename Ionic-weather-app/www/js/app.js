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

     //make api call for auto ip, then location 
              //query the weather underground api by lat and lng to get auto ip first, then html 5 location 
              $q(function(resolve, reject) {
                //gets current weather data
              $http.get('http://api.wunderground.com/api/2f0c8e826c308010/conditions/forecast/geolookup/q/autoip.json')
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
                  console.log("weather ", weather.location.lat);
                  console.log("weather ", weather.location.lon);
                  console.log("first weather", weather);
                  self.cityName = weather.location.city;
                  console.log("self.cityName ", self.cityName);

                  self.feels = Math.round(weather.current_observation.temp_f);

                  //personal weather station id
                  self.station = weather.current_observation.station_id;

                  console.log("station ", self.station);

              }).then(function(){
                console.log("stuffy ", self.station);
                // var stationObject = { "station" : self.station}
                // localStorage.setItem("searchHistory", JSON.stringify(stationObject));
                // "stationSearches":[
                //       {"firstName":"John", "lastName":"Doe"}
                //   ]

                // for(var key in localStorage){
                //   return key;
                // }

                //get stationHistory or set if not exist
                console.log("station history ", localStorage.stationHistory);
                if(localStorage.stationHistory !== undefined){
                      
                      //parse the stations in history
                      var parsedStationArray = JSON.parse(localStorage.stationHistory);

                      //if current station if not in array 
                      if(parsedStationArray.indexOf(self.station) === -1){

                            //push new item
                            parsedStationArray.push(self.station);

                            //stringify the new array
                            var alteredArray = JSON.stringify(parsedStationArray);

                            //set the new array in local storage
                            localStorage.stationHistory = alteredArray;
                        
                      } else {
                        console.log("already there");
                      }



                } else {
                  //create local storage
                  localStorage.setItem("stationHistory", "[]");

                  
                      //parse the stations in history
                      var parsedStationArray = JSON.parse(localStorage.stationHistory);

                      //if current station if not in array 
                      if(parsedStationArray.indexOf(self.station) === -1){

                            //push new item
                            parsedStationArray.push(self.station);

                            //stringify the new array
                            var alteredArray = JSON.stringify(parsedStationArray);

                            //set the new array in local storage
                            localStorage.stationHistory = alteredArray;
                        
                      } else {
                        console.log("already there");
                      }



                }

              });

        //******** AUTO IP CALL **********//
               //query the weather underground api by lat and lng to get auto ip first, then html 5 location 
              $q(function(resolve, reject) {
                //gets current weather data
              $http.get('http://api.wunderground.com/api/2f0c8e826c308010/conditions/forecast/geolookup/q/autoip.json')
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
                  console.log("weather ", weather.location.lat);
                  console.log("weather ", weather.location.lon);
                  console.log("weather", weather);

                  self.feels = Math.round(weather.current_observation.temp_f);
                  self.cityName = weather.location.city;

                  //personal weather station id
                  self.station = weather.current_observation.station_id;
                   if(localStorage.stationHistory !== undefined){
                      
                      //parse the stations in history
                      var parsedStationArray = JSON.parse(localStorage.stationHistory);

                      //if current station if not in array 
                      if(parsedStationArray.indexOf(self.station) === -1){

                            //push new item
                            parsedStationArray.push(self.station);

                            //stringify the new array
                            var alteredArray = JSON.stringify(parsedStationArray);

                            //set the new array in local storage
                            localStorage.stationHistory = alteredArray;
                        
                      } else {
                        console.log("already there");
                      }



                } else {
                  //create local storage
                  localStorage.setItem("stationHistory", "[]")
                }

              });

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

                        //search underground by zip
                        $q(function(resolve, reject) {
                            //gets current weather data
                          $http.get('http://api.wunderground.com/api/2f0c8e826c308010/geolookup/conditions/forecast/q/'+lat+','+lng+'.json')
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
                              console.log("weather ", weather.location.lat);
                              console.log("weather ", weather.location.lon);
                              console.log("weather", weather);

                              self.feels = Math.round(weather.current_observation.temp_f);
                              self.cityName = weather.location.city;

                              self.gotGeo = true;

                              var forcast = weather.forcast;
                              var forecastArray = weather.forecast.simpleforecast.forecastday;

                              console.log("forecastArray ", forecastArray);
                              self.fiveDayForcast = forecastArray;
                              console.log("far ", forecastArray[0].high.fahrenheit);

                               //personal weather station id
                  self.station = weather.current_observation.station_id;
                   if(localStorage.stationHistory !== undefined){
                      
                      //parse the stations in history
                      var parsedStationArray = JSON.parse(localStorage.stationHistory);

                      //if current station if not in array 
                      if(parsedStationArray.indexOf(self.station) === -1){

                            //push new item
                            parsedStationArray.push(self.station);

                            //stringify the new array
                            var alteredArray = JSON.stringify(parsedStationArray);

                            //set the new array in local storage
                            localStorage.stationHistory = alteredArray;
                        
                      } else {
                        console.log("already there");
                      }



                } else {
                  //create local storage
                  localStorage.setItem("stationHistory", "[]")
                }



                          });

                      });

                self.searchForZip = function($event, newZip){

                  if($event.keyCode === 13 && self.gotGeo === true){
                      console.log("newZip ", newZip);
            

                     $q(function(resolve, reject) {
                            //gets current weather data
                          $http.get('http://api.wunderground.com/api/2f0c8e826c308010/geolookup/conditions/forecast/q/'+newZip+'.json')
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
                              console.log("weather ", weather.location.lat);
                              console.log("weather ", weather.location.lon);
                              console.log("weather", weather);

                              self.feels = Math.round(weather.current_observation.temp_f);
                              self.cityName = weather.location.city;
                               var stationObject = { "station" : self.station}
                               console.log("stationObject", stationObject);

                                //personal weather station id
                  self.station = weather.current_observation.station_id;
                   if(localStorage.stationHistory !== undefined){
                      
                      //parse the stations in history
                      var parsedStationArray = JSON.parse(localStorage.stationHistory);

                      //if current station if not in array 
                      if(parsedStationArray.indexOf(self.station) === -1){

                            //push new item
                            parsedStationArray.push(self.station);

                            //stringify the new array
                            var alteredArray = JSON.stringify(parsedStationArray);

                            //set the new array in local storage
                            localStorage.stationHistory = alteredArray;
                        
                      } else {
                        console.log("already there");
                      }



                } else {
                  //create local storage
                  localStorage.setItem("stationHistory", "[]")
                }


                          });
                  }
                      
                }

              //get a search box before lunch that searches by zip


      


});
