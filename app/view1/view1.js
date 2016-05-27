'use strict';

angular.module('myApp.view1', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/view1', {
        templateUrl: 'view1/view1.html',
        controller: 'View1Ctrl'
    });
}])

.controller('View1Ctrl', ['$scope', 'venueInfo', 'mapInfo', function($scope, venueInfo, mapInfo) {

    var raw_data = {};

    venueInfo.success(function(data) {
        // $scope.events = data.resultsPage.results.event;
        raw_data = data;
        $scope.setNewDecade();

    });

    mapInfo.success(function(data) {
        $scope.map = data;
    });


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

        $scope.routes = getRoutesFromData();
        $scope.city_data = getCitiesFromData();
        $scope.points = getPointsFromData();
    };

    var getRoutesFromData = function() {
        var paths = [];
        // var previousEventLatLng = null;
        for (var i = 0; i < $scope.decade_events.length - 1; i++) {
            paths.push({
                type: "LineString",
                coordinates: [
                    [$scope.decade_events[i].location.lng, $scope.decade_events[i].location.lat],
                    [$scope.decade_events[i + 1].location.lng, $scope.decade_events[i + 1].location.lat]
                ]
            });
        }

        return paths;
    };


    var getPointsFromData = function() {
        var points = [];
        for (var i = 0; i < $scope.decade_events.length - 1; i++) {
            points.push([$scope.decade_events[i].location.lng, $scope.decade_events[i].location.lat]);
        }
        return points;
    };




    var getCitiesFromData = function() {
        var city_dictionary = {};

        for (var year in $scope.decade_events) {
            var event = $scope.decade_events[year];
            // venue->metro_area->displayName
            var city = event.venue.metroArea.displayName;
            if (city in city_dictionary) {
                city_dictionary[city]['events'].push(event);
                city_dictionary[city]['num_events']++;
            } else {
                // lat, lng not working 
                city_dictionary[city] = {
                    'lat': event.location.lat,
                    'lng': event.location.lng,
                    'num_events': 1,
                    'name': city,
                    'events': [event]
                };
            }
        }

        return makeCityArray(city_dictionary)
    };

    var makeCityArray = function(city_dictionary) {
        var city_array = [];
        for (var city in city_dictionary) {
            var city_obj = city_dictionary[city];
            city_array.push(city_obj);
        }

        return city_array;
    };



    // pagination weirdness 
    $scope.getDecadeName = function(page) {
        return 1950 + page * 10;
    };

    $scope.totalItems = 60;


    // event listener on mouseover nodes
    $scope.showDetailPanel = function(item) {
        $scope.current_venue = item.name + '--num_events: '+item.num_events;
        $scope.$apply();
    }

}]);
