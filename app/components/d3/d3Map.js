angular.module('myApp.directives', ['d3'])
    .directive('d3Map', ['d3Service', '$window', function(d3Service, $window) {
        return {
            restrict: 'EA',
            scope: {
                events: '=', // bi-directional data-binding
                routes: '=', // bi-directional data-binding
                map: '=', // bi-directional data-binding
                cities: '=',
                onMouseOver: '&' // parent execution binding
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


                    // playing around to make sure nodes get mouseover
                    var nodes_svg = svg.append('g').attr('id', 'nodes');

                    var map_svg = svg.append('g').attr('id', 'map');
                    var routes_svg = svg.append('g').attr('id', 'routes');

                    var projection = d3.geo.albers()
                        .rotate([96, 0])
                        .center([-.6, 38.7])
                        .parallels([29.5, 45.5])
                        .scale(1070)
                        .translate([width / 2, height / 2])
                        .precision(.1);

                    var path = d3.geo.path().projection(projection);
                    

                    // custom d3 code
                    scope.render = function() {
                        renderNodes(scope.events, projection, path);
                        // renderCityNodes(scope.cities, projection, path);                        
                        renderRoutes(scope.routes, projection, path);

                        // d3.select(self.frameElement).style("height", height + "px");
                    };

                    // data can be passed by the controller
                    // useful for user input 
                    var renderNodes = function(data, projection, path) {
                        // exit all points
                        var nodes = nodes_svg.selectAll("circle")
                            .data(data);

                        nodes.enter().append("circle")
                            .attr("cx", function(d, i) {
                                return projection([d.venue.lng, d.venue.lat])[0];
                            })
                            .attr("cy", function(d, i) {
                                return projection([d.venue.lng, d.venue.lat])[1];
                            })
                            .attr("class", 'venue')
                            .on('mouseover', function(d, i) {
                                return scope.onMouseOver({ item: d });
                            })

                        nodes.exit().remove();
                    };

                    var renderCityNodes = function(data, projection, path) {
                        // exit all points
                        var nodes = nodes_svg.selectAll("circle")
                            .data(data);

                        nodes.enter().append("circle")
                            .attr("cx", function(d, i) {
                                return projection([d.venue.lng, d.venue.lat])[0];
                            })
                            .attr("cy", function(d, i) {
                                return projection([d.venue.lng, d.venue.lat])[1];
                            })
                            .attr("class", 'venue')
                            .on('mouseover', function(d, i) {
                                return scope.onMouseOver({ item: d });
                            })

                        nodes.exit().remove();
                    };


                    var renderRoutes = function(data, projection, path) {
                        var paths = svg.selectAll('path')
                            .data(data);

                        paths.enter()
                            .append('path')
                            .attr("d", path)
                            .attr('class', 'route');

                        paths.exit().remove();
                    };


                    var renderMap = function(us, projection, path) {
                        // interior boundaries
                        svg.append("path")
                            .datum(topojson.mesh(us, us.objects.subunits, function(a, b) {
                                return a !== b;
                            }))
                            .attr("d", path)
                            .attr("class", "state-boundary")
                            .on('mouseover', function() {
                                console.log('fuckme');
                            });

                        // exterior boundaries
                        svg.append("path")
                            .datum(topojson.mesh(us, us.objects.subunits, function(a, b) {
                                return a === b;
                            }))
                            .attr("d", path)
                            .attr("class", "us-boundary")
                            .on('mouseover', function() {
                                console.log('fuckme1');
                            });
                    };

                    renderMap(scope.map, projection, path);

                    // Browser onresize event
                    window.onresize = function() {
                        scope.$apply();
                    };

                    // Watch for resize event
                    scope.$watch(function() {
                        return angular.element($window)[0].innerWidth;
                    }, function() {
                        scope.render();
                    });

                    // watch for data changes and re-render
                    scope.$watch('events', function(newVals, oldVals) {
                        scope.render(newVals);
                        return;
                    }, true);

                });
            }
        };
    }]);
