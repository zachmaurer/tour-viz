'use strict';

angular.module('myApp.view3', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/view3', {
    templateUrl: 'view3/view3.html',
    controller: 'View3Ctrl'
  });
}])

.controller('View3Ctrl', ['$scope', 'nodesInfo', function($scope, nodesInfo) {
    console.log("view3 controller initiated");
    $scope.data = [];
	nodesInfo.success(function(data) {
        // $scope.events = data.resultsPage.results.event;
        //$scope.data = data;
        //$scope.setNewDecade();
        console.log("bubble request success");
        console.log(data[0]);
        $scope.data = data;
    });

}]);