angular.module('myApp.directives', ['d3'])
    .directive('d3Map', ['d3Service', '$window', function(d3Service, $window) {
        return {
            restrict: 'EA',
            scope: {
                events: '=', // bi-directional data-binding
                routes: '=', // bi-directional data-binding
                map: '=', // bi-directional data-binding

                onClick: '&', // parent execution binding
                // label: "@"
            },
            link: function(scope, element, attrs) {
                d3Service.d3().then(function(d3) {

                    // attributes given in through html
                    var width = parseInt(attrs.width) || 960,
                        height = parseInt(attrs.height) || 500;

                    var svg = d3.select(".map-container").append("svg")
                        .attr("width", width)
                        .attr("height", height);
                    var routes = svg.append('g').attr('id', 'routes');



                    // custom d3 code
                    scope.render = function(data) {
                        var projection = d3.geo.albers()
                            .rotate([96, 0])
                            .center([-.6, 38.7])
                            .parallels([29.5, 45.5])
                            .scale(1070)
                            .translate([width / 2, height / 2])
                            .precision(.1);

                        var path = d3.geo.path().projection(projection);

                        renderMap(scope.map, projection, path);
                        renderNodes(scope.events, projection, path);
                        renderRoutes(scope.routes, projection, path);
                        // d3.select(self.frameElement).style("height", height + "px");
                    };

                    // data can be passed by the controller
                    // useful for user input 
                    var renderNodes = function(data, projection, path) {

                        svg.selectAll("circle")
                            .data(data)
                            .enter()
                            .append("circle")
                            .attr("cx", function(d, i) {
                                console.log(projection([d.venue.lng, d.venue.lat]));
                                return projection([d.venue.lng, d.location.lat])[0];
                            })
                            .attr("cy", function(d, i) {
                                return projection([d.venue.lng, d.location.lat])[1];
                            })
                            .attr("class", 'venue');
                    };


                    var renderRoutes = function(data, projection, path) {
                        routes.selectAll('path')
                            .data(data)
                            .enter()
                            .append('path')
                            .attr("d", path)
                            .attr('class', 'route');
                    };


                    var renderMap = function(us, projection, path) {
                        // interior boundaries
                        svg.append("path")
                            .datum(topojson.mesh(us, us.objects.subunits, function(a, b) {
                                return a !== b;
                            }))
                            .attr("d", path)
                            .attr("class", "state-boundary");

                        // exterior boundaries
                        svg.append("path")
                            .datum(topojson.mesh(us, us.objects.subunits, function(a, b) {
                                return a === b;
                            }))
                            .attr("d", path)
                            .attr("class", "us-boundary");
                    };



                    // Browser onresize event
                    window.onresize = function() {
                        scope.$apply();
                    };

                    // Watch for resize event
                    scope.$watch(function() {
                        return angular.element($window)[0].innerWidth;
                    }, function() {
                        scope.render(scope.data);
                    });

                    // watch for data changes and re-render
                    scope.$watch('data', function(newVals, oldVals) {
                        scope.render(newVals);
                        return;
                    }, true);

                });
            }
        };
    }]);
