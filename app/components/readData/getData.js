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
    })
    .service('eventsService', function($http) {
        this.getEventsByCity = function(city) {
            var req = {
                method: "GET",
                url: "http://localhost:5000/api/events/city",
                headers: {
                    "Content-Type": "application/json"
                },
                params: {"city": city}
            };
            return $http(req);
        };

        this.getArtistEvents = function(artist_id, artist_name) {
            var req = {
                method: "GET",
                url: "http://localhost:5000/api/events/artist",
                headers: {
                    "Content-Type": "application/json"
                },
                params: {"id": artist_id,
                        "name": artist_name}
            };
            return $http(req);   
        };

        this.getAssociatedArtists = function(artist_id, artist_name) {
            var req = {
                method: "GET",
                url: "http://localhost:5000/api/associated/artist",
                headers: {
                    "Content-Type": "application/json"
                },
                params: {"id": artist_id,
                        "name": artist_name}
            };
            return $http(req);   
        };
    })