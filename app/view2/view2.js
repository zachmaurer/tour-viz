'use strict';

angular.module('myApp.view2', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/view2', {
        templateUrl: 'view2/view2.html',
        controller: 'View2Ctrl'
    });
}])

.controller('View2Ctrl', ['$rootScope', '$scope', 'mapInfo', 'artistsOptions', 'eventsService', '$timeout', function($rootScope, $scope, mapInfo, artistsOptions, eventsService, $timeout) {
    $scope.timeline_data = null;
    $scope.node_data = null;
    $scope.extent = {
        "dateMin": "",
        "dateMax": ""
    };
    // $scope.labelartist = '';

    // should look into caching this data so we dont load it ever tab switch
    // timelineInfo.success(function(data) {
    //     $scope.events = data;
    // });

    // nodesInfo.success(function(data) {
    //     $scope.node_data = data;
    // });


    if (!$rootScope.map) {
        mapInfo.success(function(data) {
            $rootScope.map = data;
        });
    }

    artistsOptions.success(function(data) {
        $scope.artists_options = data;
    });



    $scope.selectedArtist = function($item, $model, $label, $event) {
        this.$parent.chosen_artist = $item; // not sure why I have to do it like this...
        this.$parent.test = $scope.test == 1 ? 2 : 1;
        eventsService.getArtistEvents($item.id, $item.name).then(function(response) {
            if (response.data.length == 0) return;
            $scope.events = addTimeStampToEvents(response.data);

            $timeout(function() {
                $scope.$apply();
            });
        }, function(error) {
            console.log(error);
        });
        eventsService.getAssociatedArtists($item.id, $item.name).then(function(response) {
            if (response.data.length == 0) return;
            $scope.node_data = addTimeStampToNodes(response.data);
            $timeout(function() {
                $scope.$apply();
            });
        }, function(error) {
            console.log(error);
        });
    };



    $scope.showLabel = function(item) {
        if (item) {
            console.log(item);
            $scope.showItem = item;
            $scope.event = event;
        } else {
            console.log('no longer');
            $scope.showItem = null;

        }
        $scope.$apply();
    };

    //startDate
    var addTimeStampToEvents = function(events) {
        return events.map(function(event) {
            event.timeStamp = new Date(event.startDate);
            return event;
        });
    };

    var addTimeStampToNodes = function(artists) {
        return artists.map(function(artist) {
            for (var i in artist.events) {
                artist.events[i] = new Date(artist.events[i]);
            }
            return artist;
        });
    };

    $scope.refreshMap = function() {
        // move to root
        $scope.test = $scope.test == 1 ? 2 : 1;
    };


}]);
