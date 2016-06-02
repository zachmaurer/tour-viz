'use strict';

angular.module('myApp.view1', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/view1', {
        templateUrl: 'view1/view1.html',
        controller: 'View1Ctrl'
    });
}])

.controller('View1Ctrl', ['$rootScope', '$scope', 'venueInfo', 'mapInfo', 'cityOptions', 'eventsService', function($rootScope, $scope, venueInfo, mapInfo, cityOptions, eventsService) {

    var raw_data = {};
    // $scope.chosen_city = {city: 'San Francisco'};
    venueInfo.success(function(data) {
        // $scope.events = data.resultsPage.results.event;
        raw_data = data;
        $scope.setNewDecade();
        // $scope.city_options = getCityList(raw_data);
    });

    cityOptions.success(function(data) {
        $scope.city_options = data;

    });

    if (!$rootScope.map) {
        mapInfo.success(function(data) {
            $rootScope.map = data;
        });
    }


    $scope.selectedCity = function($item, $model, $label, $event) {
        this.$parent.chosen_city = $item; // not sure why I have to do it like this...
        this.$parent.getDataFromCity();

    };

    $scope.setNewDecade = function() {
        $scope.decade_events = [];

        // weirdness to get pagination to start from 1950-2010
        if ($scope.item < 5) {
            $scope.decade = Math.floor(5 + $scope.item); // 1950 +page
        } else {
            $scope.decade = Math.floor($scope.item - 5); //2000
        }

        if (!$scope.decade) {
            $scope.decade = 7;
        }

        $scope.decade_events = [];
        for (var century = 19; century < 21; century++) {
            for (var year = 0; year < 10; year++) {
                var decade = String(century) + String($scope.decade) + String(year);
                if (decade in raw_data) {
                    for (var i in raw_data[decade]) {
                        $scope.decade_events.push(raw_data[decade][i]);
                    }
                }
            }
        }

        // $scope.routes = getRoutesFromData();
        // $scope.city_data = getCitiesFromData();
        $scope.points = getPointsFromData();
        if ($scope.chosen_city) {
            $scope.getDataFromCity();
        } else {
            $scope.refreshMap();
        }
    };

    $scope.refreshMap = function() {
    	// move to root
        $scope.test = $scope.test == 1 ? 2 : 1;
    };


    $scope.getDataFromCity = function() {
        var venues = {};
        var artists = {};
        for (var i = 0; i < $scope.decade_events.length; i++) {

            // either of them are substrings 
            if ($scope.decade_events[i].location.city.indexOf($scope.chosen_city.name) > -1 || $scope.chosen_city.name.indexOf($scope.decade_events[i].location.city) > -1) {

                var venue = $scope.decade_events[i].venue.displayName;
                if (venue in venues) {
                    venues[venue]++;
                } else {
                    venues[venue] = 1;
                }

                for (var j = 0; j < $scope.decade_events[i].performance.length; j++) {
                    var artist = $scope.decade_events[i].performance[j].artist.displayName;
                    if (artist in artists) {
                        artists[artist]++;
                    } else {
                        artists[artist] = 1;
                    }
                }
            }
        }

        // need to make them arrays, I think this is the fastest way??
        var venues_arr = [];
        for (var key in venues) {
            venues_arr.push({ name: key, total: venues[key] });
        };

        var artists_arr = [];
        for (var key1 in artists) {
            artists_arr.push({ name: key1, total: artists[key1] });
        }
        $scope.venues = venues_arr.sort(function(a, b) {
            return (a.total > b.total) ? -1 : ((b.total > a.total) ? 1 : 0); });
        $scope.artists = artists_arr.sort(function(a, b) {
            return (a.total > b.total) ? -1 : ((b.total > a.total) ? 1 : 0); });
        $scope.refreshMap();
    };




    var getPointsFromData = function() {
        var points = [];
        for (var i = 0; i < $scope.decade_events.length; i++) {
            points.push([$scope.decade_events[i].location.lng, $scope.decade_events[i].location.lat]);
        }
        return points;
    };


    // var getRoutesFromData = function() {
    //     var paths = [];
    //     // var previousEventLatLng = null;
    //     for (var i = 0; i < $scope.decade_events.length - 1; i++) {
    //         paths.push({
    //             type: "LineString",
    //             coordinates: [
    //                 [$scope.decade_events[i].location.lng, $scope.decade_events[i].location.lat],
    //                 [$scope.decade_events[i + 1].location.lng, $scope.decade_events[i + 1].location.lat]
    //             ]
    //         });
    //     }

    //     return paths;
    // };


    // var getCitiesFromData = function() {
    //     var city_dictionary = {};

    //     for (var year in $scope.decade_events) {
    //         var event = $scope.decade_events[year];
    //         // venue->metro_area->displayName
    //         var city = event.venue.metroArea.displayName;
    //         if (city in city_dictionary) {
    //             city_dictionary[city]['events'].push(event);
    //             city_dictionary[city]['num_events']++;
    //         } else {
    //             // lat, lng not working 
    //             city_dictionary[city] = {
    //                 'lat': event.location.lat,
    //                 'lng': event.location.lng,
    //                 'num_events': 1,
    //                 'name': city,
    //                 'events': [event]
    //             };
    //         }
    //     }

    //     return makeCityArray(city_dictionary)
    // };

    // var makeCityArray = function(city_dictionary) {
    //     var city_array = [];
    //     for (var city in city_dictionary) {
    //         var city_obj = city_dictionary[city];
    //         city_array.push(city_obj);
    //     }

    //     return city_array;
    // };



    // pagination weirdness 
    $scope.getDecadeName = function(page) {
        return 1950 + page * 10;
    };

    $scope.totalItems = 60;


    // // event listener on mouseover nodes
    // $scope.showDetailPanel = function(item) {
    //     $scope.current_venue = item.name + '--num_events: ' + item.num_events;
    //     $scope.$apply();
    // }

}]);
