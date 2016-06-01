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
        return $http.get('client_data/Lolawolf_bubble_agg.json');
    })
    .factory('cityOptions', function($http) {
        return $http.get('client_data/city_list.json');
    })
    .factory('artistsOptions', function($http) {
        return $http.get('client_data/artists_list.json');
    });