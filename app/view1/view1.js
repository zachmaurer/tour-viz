'use strict';

angular.module('myApp.view1', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/view1', {
        templateUrl: 'view1/view1.html',
        controller: 'View1Ctrl'
    });
}])


.controller('View1Ctrl', ['$rootScope', '$scope', 'venueInfo', 'mapInfo', 'cityOptions', 'eventsService', function($rootScope, $scope, venueInfo, mapInfo, cityOptions, eventsService) {
     $scope.extent = { "dateMin" : "",
                        "dateMax" :"" };

    var raw_data = {};

    cityOptions.success(function(data) {
        $scope.city_options = data;
    });

    eventsService.getAllEvents().then(function(response) {
        if (response.data.length == 0) return;
        $rootScope.points = addTimeStampToEvents(response.data);
        $scope.refreshMap();
    }, function(error) {
        console.log(error);
    });


    if (!$rootScope.map) {
        mapInfo.success(function(data) {
            $rootScope.map = data;
        });
    }

 	var addTimeStampToEvents = function(events) {
        return events.map(function(event) {
            event.timeStamp = new Date(event.date);
            return event;
        });
    };
    $scope.selectedCity = function($item, $model, $label, $event) {
        this.$parent.chosen_city = $item; // not sure why I have to do it like this...
        //this.$parent.getDataFromCity();
        eventsService.getEventsByCity($item.name).then(function(response){
            $scope.artists = response.data.artist_data.sort(function(a, b) {
                return (a.total > b.total) ? -1 : ((b.total > a.total) ? 1 : 0);
            });
            $scope.venues = response.data.venue_data.sort(function(a, b) {
                return (a.total > b.total) ? -1 : ((b.total > a.total) ? 1 : 0);
            });
            $scope.refreshMap();
        }, function(){

        });


    };

    $scope.refreshMap = function() {
        // move to root
        $scope.test = $scope.test == 1 ? 2 : 1;
    };


    // $scope.getDataFromCity = function() {
    //     var venues = {};
    //     var artists = {};
    //     for (var i = 0; i < $scope.decade_events.length; i++) {

    //         // either of them are substrings 
    //         if ($scope.decade_events[i].location.city.indexOf($scope.chosen_city.name) > -1 || $scope.chosen_city.name.indexOf($scope.decade_events[i].location.city) > -1) {

    //             var venue = $scope.decade_events[i].venue.displayName;
    //             if (venue in venues) {
    //                 venues[venue]++;
    //             } else {
    //                 venues[venue] = 1;
    //             }

    //             for (var j = 0; j < $scope.decade_events[i].performance.length; j++) {
    //                 var artist = $scope.decade_events[i].performance[j].artist.displayName;
    //                 if (artist in artists) {
    //                     artists[artist]++;
    //                 } else {
    //                     artists[artist] = 1;
    //                 }
    //             }
    //         }
    //     }

    //     // need to make them arrays, I think this is the fastest way??
    //     var venues_arr = [];
    //     for (var key in venues) {
    //         venues_arr.push({ name: key, total: venues[key] });
    //     };

    //     var artists_arr = [];
    //     for (var key1 in artists) {
    //         artists_arr.push({ name: key1, total: artists[key1] });
    //     }
    //     $scope.venues = venues_arr.sort(function(a, b) {
    //         return (a.total > b.total) ? -1 : ((b.total > a.total) ? 1 : 0);
    //     });
    //     $scope.artists = artists_arr.sort(function(a, b) {
    //         return (a.total > b.total) ? -1 : ((b.total > a.total) ? 1 : 0);
    //     });
    //     $scope.refreshMap();
    // };

    var getPointsFromData = function() {
        var points = [];
        for (var i = 0; i < $scope.decade_events.length; i++) {
            points.push([$scope.decade_events[i].location.lng, $scope.decade_events[i].location.lat]);
        }
        return points;
    };

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
