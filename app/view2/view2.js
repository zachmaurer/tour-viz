'use strict';

angular.module('myApp.view2', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/view2', {
    templateUrl: 'view2/view2.html',
    controller: 'View2Ctrl'
  });
}])

.controller('View2Ctrl', ['$scope', 'timelineInfo', function($scope, timelineInfo) {
	$scope.data = [];
	console.log("timeline");
	timelineInfo.success(function(data) {
        // $scope.events = data.resultsPage.results.event;
        //$scope.data = data;
        //$scope.setNewDecade();
        console.log("timelineInfo success");
        console.log(data[0]);
        $scope.data = data;
    });


}]);