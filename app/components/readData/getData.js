angular.module('myApp.factories', [])
    .factory('venueInfo', function($http) {
        return $http.get('client_data/events_dummy_bucketed.json');
    })
    .factory('mapInfo', function($http) {
        return $http.get('world-50m.json');

    })
    .factory('timelineInfo', function($http) {
        return $http.get('client_data/BruceSpringsteen.json');
    })
    .factory('nodesInfo', function($http) {
        return $http.get('client_data/lolawolf_bubble.json');
    });