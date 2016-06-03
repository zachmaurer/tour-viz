angular.module('myApp.directives.bar', ['d3'])
    .directive('d3Bar', ['d3Service', '$window', function(d3Service, $window) {
        return {
            restrict: 'EA',
            scope: {
                artists: '=',
                venues: '=',
                test: '=',
                timeline: '=',
                onMouseOver: '&' // parent execution binding
                    // label: "@"
            },
            link: function(scope, element, attrs) {
                d3Service.d3().then(function(d3) {

                    var filterByTime = function(data) {
                        for (var i in data) {
                            var artist = data[i];
                            artist.total = artist.events.length;
                            for (var j in artist.events) {
                                var event_time = new Date(artist.events[j]);
                                if (event_time < scope.timeline.dateMin || event_time > scope.timeline.dateMax) {
                                    artist.total--;
                                }
                            }
                        }
                        return data;
                    };

                    var sorter = function(a, b) {
                        return (a.total > b.total) ? -1 : ((b.total > a.total) ? 1 : 0);
                    };

                    scope.renderGraphs = function() {
                        var artist_data = filterByTime(scope.artists);
                        var venue_data = filterByTime(scope.venues);
                        makeGraph(artist_data, '.chart-artists', 'Artists');
                        makeGraph(venue_data, '.chart-venues', 'Venues');
                    };

                    var makeGraph = function(data, data_type, title) {

                        // too slow
                        // data.sort(function(a, b) {
                        //     return (a.total > b.total) ? -1 : ((b.total > a.total) ? 1 : 0);
                        // });

                        var x = d3.scale.linear()
                            .domain([0, d3.max(data, function(d) {
                                return d.total;
                            })])
                            .range([0, 250]);

                        d3.select(data_type).selectAll("div").remove();
                        d3.select(data_type).selectAll("h3").remove();

                        // d3.select(data_type).append('h3')
                        // .text(title)
                        // .attr('class', 'title');



                        var row = d3.select(data_type)
                            .selectAll("div")
                            .data(data)
                            .enter().append("div")
                            .filter(function(d) {
                                return d.total > 0;
                            })
                            .attr('class', 'graph-row row');

                        // Add the labels
                        var labels = row.append("div")
                            .text(function(d, i) {
                                return d.name;
                            })
                            .attr('class', 'graph-label');

                        // add the bars
                        var bars = row.append('div')
                            .text(function(d) {
                                return d.total;
                            })
                            .attr('class', 'graph-bar')
                            .style("width", function(d) {
                                return x(d.total) + "px";
                            });
                    };

                    scope.renderGraphs();

                    // watch for data changes and re-render
                    scope.$watch('artists', function(newVals, oldVals) {
                        scope.renderGraphs();
                        return;
                    }, true);

                    scope.$watch('timeline', function(newVals, oldVals) {
                        scope.renderGraphs();
                        return;
                    }, true);
                });
            }
        };
    }]);
