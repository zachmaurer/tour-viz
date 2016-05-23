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
        // $scope.events = data.resultsPage.results.event;
        $scope.data = data;
        $scope.setNewDecade();
        
    });

    mapInfo.success(function(data) {
        $scope.map = data;
    });

    var getRoutesFromData = function() {
        var paths = [];
        // var previousEventLatLng = null;
        for (var i = 0; i < $scope.decade_events.length - 1; i++) {
            paths.push({
                type: "LineString",
                coordinates: [
                    [$scope.decade_events[i].venue.lng, $scope.decade_events[i].venue.lat],
                    [$scope.decade_events[i + 1].venue.lng, $scope.decade_events[i + 1].venue.lat]
                ]
            });
        }

        return paths;
    };

    var getCitiesFromData = function(events) {

    };


    $scope.setNewDecade = function() {
		$scope.decade_events = [];

    	// weirdness to get pagination to start from 1950-2010
    	if ($scope.item < 5) {
    		$scope.decade = Math.floor(5+$scope.item); // 1950 +page
    	} else {
    		$scope.decade = Math.floor($scope.item-5); //2000
    	}

    	if (!$scope.decade) {
    		$scope.decade = 7;
    	}


    	console.log($scope.decade);
    	$scope.decade_events = [];
        for (var century = 19; century < 21; century++) {
            for (var year = 0; year < 10; year++) {
            	var decade = String(century) + String($scope.decade) + String(year);
            	console.log(decade);
            	if (decade in $scope.data) {
            		for(var i in $scope.data[decade]) {
            			$scope.decade_events.push($scope.data[decade][i]);
            		}
            		
            	}
            }
        }
       $scope.routes = getRoutesFromData();
    };

    $scope.getDecadeName = function(page) {
    	return 1950 + page*10;
    	
    };



    // pagination weirdness 
  $scope.totalItems = 60;
 


    // $scope.onClick = function(item) {
    //     $scope.$apply(function() {
    //         if (!$scope.showDetailPanel)
    //             $scope.showDetailPanel = true;
    //         $scope.detailItem = item;
    //     });
    //     alert(item);
    // };

    $scope.showDetailPanel = function(item) {
        $scope.current_venue = item.displayName;
        $scope.$apply();
    }

}]);
