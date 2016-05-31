angular.module('myApp.directives.map', ['d3'])
    .directive('d3Map', ['d3Service', '$window', function(d3Service, $window) {
        return {
            restrict: 'EA',
            scope: {
                events: '=', // bi-directional data-binding
                routes: '=', // bi-directional data-binding
                map: '=', // bi-directional data-binding
                cities: '=',
                points: '=',
                chosencity: '=',
                test: '=',
                onMouseOver: '&' // parent execution binding
                    // label: "@"
            },
            link: function(scope, element, attrs) {
                d3Service.d3().then(function(d3) {

                    // attributes given in through html
                    var width = parseInt(attrs.width) || 960,
                        height = parseInt(attrs.height) || 960,
                        margin = { top: 20, right: 20, bottom: 30, left: 40 },
                        height_hide_antartica = 670,
                        hex_bin_size = 10;

                    var svg = d3.select(".map-container").append("svg")
                        .attr("width", width)
                        .attr("height", height_hide_antartica);

                    // order matters for event listener priority
                    var map_svg = svg.append('g').attr('id', 'map');
                    var hex_svg = svg.append('g').attr('id', 'hex').attr('clip-path', 'url(#land-clip)');
                    var routes_svg = svg.append('g').attr('id', 'routes');
                    var nodes_svg = svg.append('g').attr('id', 'nodes');

                    var projection = d3.geo.mercator()
                        .scale((width + 1) / 2 / Math.PI)
                        .translate([width / 2, height / 2])
                        .precision(.1);

                    var path = d3.geo.path()
                        .projection(projection);


                    // hex and routes eliminates map after a couple turns 
                    scope.render = function() {
                        // renderNodes(scope.events, projection, path);
                        renderHeatHex(scope.points, projection, path);
                        // renderCityNodes(scope.cities, projection, path);
                        // renderRoutes(scope.routes, projection, path);
                        renderSelectedHex(scope.chosencity, projection, path);
                    };


                    var renderNodes = function(data, projection, path) {
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
                            });

                        nodes.exit().remove();
                    };


                    var renderSelectedHex = function(city, projection, path) {
                        if(!city) return;

                        hex_svg.selectAll(".selected-hexagon").remove();

                        var selectedPoint = [projection([city.lng, city.lat]), projection([city.lng, city.lat])];


                        var hexbin = d3.hexbin()
                            .size([width, height])
                            .radius(hex_bin_size);

                        var hexes = hex_svg
                            .selectAll(".selected-hexagon")
                            .data(hexbin(selectedPoint));

                        hexes.enter()
                            .append("path")
                            .attr("class", "selected-hexagon")
                            .attr("d", hexbin.hexagon())
                            .attr("transform", function(d) {
                                return "translate(" + d.x + "," + d.y + ")";
                            });

                        hexes.exit().remove();

                    };

                    //  I just need lat longs, no cities here 
                    var renderHeatHex = function(lat_long, projection, path) {
                        var points = [];
                        // need to go from lat_lng to x_y
                        for (var i = 0; i < lat_long.length; i++) {
                            points.push(projection(lat_long[i]));
                        }

                        var color = d3.scale.linear()
                            .domain([0, 20])
                            .range(["#ddd", "steelblue"])
                            .interpolate(d3.interpolateLab);

                        var hexbin = d3.hexbin()
                            .size([width, height])
                            .radius(hex_bin_size);

                        var hexes = hex_svg
                            .selectAll(".hexagon")
                            .data(hexbin(points))

                        hexes.enter()
                            .append("path")
                            .attr("class", "hexagon")
                            .attr("d", hexbin.hexagon())
                            .attr("transform", function(d) {
                                return "translate(" + d.x + "," + d.y + ")";
                            })
                            .style("fill", function(d) {
                                return color(d.length);
                            })

                        .on('mouseover', function(d, i) {
                            // return scope.onMouseOver({ item: d });
                            console.log('HEX------' + d);
                        });

                        hexes.exit().remove();
                    };


                    var renderCityNodes = function(data, projection, path) {
                        // exit all points
                        nodes_svg.selectAll("circle").remove();
                        nodes_svg.selectAll("text").remove();
                        var nodes = nodes_svg.selectAll("circle")
                            .data(data);

                        nodes.enter().append("circle")
                            .attr("cx", function(d, i) {
                                return projection([d.lng, d.lat])[0];
                            })
                            .attr("cy", function(d, i) {
                                return projection([d.lng, d.lat])[1];
                            })
                            .attr("r", function(d, i) {
                                return d.num_events;
                            })
                            .attr("class", 'city')
                            .on('mouseover', function(d, i) {
                                return scope.onMouseOver({ item: d });
                            });

                        /* Create the text for each block */
                        nodes.enter().append("text")
                            .attr("dx", function(d) {
                                return projection([d.lng, d.lat])[0]
                            })
                            .attr("dy", function(d) {
                                return projection([d.lng, d.lat])[1]
                            })
                            .attr("class", 'city-label')
                            .text(function(d) {
                                return d.num_events
                            })

                        nodes.exit().remove();
                    };


                    var renderRoutes = function(data, projection, path) {
                        var paths = routes_svg.selectAll('path')
                            .data(data);

                        paths.exit().remove();

                        paths.enter()
                            .append('path')
                            .attr("d", path)
                            .attr('class', 'route')
                            .on('mouseover', function(d, i) {
                                console.log('route' + i);
                            });

                        paths.exit().remove();
                    };

                    var renderUSMap = function(us, projection, path) {
                        // interior boundaries
                        map_svg.append("path")
                            .datum(topojson.mesh(us, us.objects.subunits, function(a, b) {
                                return a !== b;
                            }))
                            .attr("d", path)
                            .attr("class", "state-boundary")
                            .on('mouseover', function() {
                                console.log('state boundary');
                            });

                        // exterior boundaries
                        map_svg.append("path")
                            .datum(topojson.mesh(us, us.objects.subunits, function(a, b) {
                                return a === b;
                            }))
                            .attr("d", path)
                            .attr("class", "us-boundary")
                            .on('mouseover', function() {
                                console.log('us boundry');
                            });
                    };

                    var renderWorldMap = function(world, projection, path) {
                        // makes clip path 
                        map_svg
                            .append("clipPath")
                            .attr("id", "land-clip") // give the clipPath an ID
                            .append('path')
                            .datum(topojson.feature(world, world.objects.land))
                            .attr("d", path);


                        // makes actual land path
                        map_svg
                            .append('path')
                            .datum(topojson.feature(world, world.objects.land))
                            .attr("id", "land")
                            .attr("d", path)
                            .on('mouseover', function(d, i) {
                                console.log('land');
                            });


                        // makes country boundaries
                        map_svg.insert("path", ".graticule")
                            .datum(topojson.mesh(world, world.objects.countries, function(a, b) {
                                return a !== b;
                            }))
                            .attr("class", "boundary")
                            .attr("d", path)
                            .on('mouseover', function(d, i) {
                                console.log('boundary');
                            });
                    };
                    renderWorldMap(scope.map, projection, path);
                    // renderUSMap(scope.map, projection, path);

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
                    scope.$watch('test', function(newVals, oldVals) {
                        scope.render(newVals);
                        return;
                    }, true);

               
                });
            }
        };
    }]);
