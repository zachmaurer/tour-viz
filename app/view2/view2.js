'use strict';

angular.module('myApp.view2', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/view2', {
    templateUrl: 'view2/view2.html',
    controller: 'View2Ctrl'
  });
}])

.controller('View2Ctrl', ['$scope', 'timelineInfo', 'nodesInfo', function($scope, timelineInfo, nodesInfo) {
	$scope.timeline_data = null;
    $scope.node_data = null;
    $scope.dateMin = "hi";
    $scope.dateMax = "hi";


    timelineInfo.success(function(data) {
        $scope.timeline_data = data;
    });

    nodesInfo.success(function(data) {
        $scope.node_data = data;
    });

    // $scope.timechanged = function(min, max) {
    //     console.log(min);
    //     console.log(max);
    // };


}]);