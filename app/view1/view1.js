'use strict';

angular.module('myApp.view1', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/view1', {
        templateUrl: 'view1/view1.html',
        controller: 'View1Ctrl'
    });
}])

.controller('View1Ctrl', ['$scope', 'venueInfo', 'mapInfo', function($scope, venueInfo, mapInfo) {

    venueInfo.success(function(data) {
        $scope.events = data.resultsPage.results.event;
        $scope.routes = getRoutesFromData($scope.events);
    });

    mapInfo.success(function(data) {
    	$scope.map = data;
    });

    var getRoutesFromData = function(events) {
        var paths = [];
        // var previousEventLatLng = null;
        for (var i = 0; i < events.length - 1; i++) {
            paths.push({
                type: "LineString",
                coordinates: [
                    [events[i].venue.lng, events[i].venue.lat],
                    [events[i + 1].venue.lng, events[i + 1].venue.lat]
                ]
            });
        }

        return paths;
    };

    // $scope.onClick = function(item) {
    //     $scope.$apply(function() {
    //         if (!$scope.showDetailPanel)
    //             $scope.showDetailPanel = true;
    //         $scope.detailItem = item;
    //     });
    //     alert(item);
    // };

    // $scope.showDetailPanel = function(item) {
    //     alert(item.name + '--' + item.score);
    // }

}]);
