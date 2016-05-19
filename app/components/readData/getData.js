angular.module('myApp.factories', [])
    .factory('venueInfo', function($http) {
        return $http.get('test_data.json');
    })
    .factory('mapInfo', function($http) {
        return $http.get('us-states.json');
    });
