'use strict';

angular.module('myApp.view2', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/view2', {
    templateUrl: 'view2/view2.html',
    controller: 'View2Ctrl'
  });
}])

.controller('View2Ctrl', ['$scope', 'timelineInfo', 'nodesInfo', 'artistsOptions', function($scope, timelineInfo, nodesInfo, artistsOptions) {
  $scope.timeline_data = null;
     $scope.node_data = null;
     $scope.extent = { "dateMin" : "hi",
                        "dateMax" :"hi" };

 // should look into caching this data so we dont load it ever tab switch
    timelineInfo.success(function(data) {
        $scope.events = data;
    });

    nodesInfo.success(function(data) {
        $scope.node_data = data;
    });

    artistsOptions.success(function(data) {
        $scope.artists_options = data;
    });



    $scope.selectedArtist = function($item, $model, $label, $event) {
        this.$parent.chosen_artist = $item; // not sure why I have to do it like this...
        this.$parent.test = $scope.test == 1 ? 2 : 1;
        this.$parent.getDataForArtist();
    };

    $scope.getDataForArtist = function() {
        // need mo data 
         //$scope.chosen_artist 
            // {id: 2135, name: Bruce}



        // $scope.events = only events with id == $scope.chosen_artist.id 
        // $scope.node_data = ??? data doesnt exist...

    };

}]);