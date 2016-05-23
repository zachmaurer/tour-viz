angular.module('myApp.factories', [])
    .factory('venueInfo', function($http) {
        return $http.get('client_data/events_dummy_bucketed.json');
    })
    .factory('mapInfo', function($http) {
        return $http.get('us-states.json');
    });
