angular.module('myApp.directives.artistmap', ['d3'])
    .directive('d3ArtistMap', ['d3Service', '$window', function(d3Service, $window) {
        return {
            restrict: 'EA',
            scope: {
                routes: '=', // bi-directional data-binding
                map: '=', // bi-directional data-binding
                events: '=',
                timeline: '=',
                test: '=',
                onMouseOver: '&' // parent execution binding
                    // label: "@"
            },
            link: function(scope, element, attrs) {
                d3Service.d3().then(function(d3) {

                    // attributes given in through html
                    var width = parseInt(attrs.width) || 500,
                        height = parseInt(attrs.height) || 750,
                        margin = { top: 20, right: 20, bottom: 30, left: 40 },
                        height_hide_antartica = 480,
                        hex_bin_size = 6;

                    var svg = d3.select(".map-container").append("svg")
                        .attr("width", width)
                        .attr("height", height_hide_antartica);

                    // order matters for event listener priority
                    var map_svg = svg.append('g').attr('id', 'map');
                    var hex_svg = svg.append('g').attr('id', 'hex').attr('clip-path', 'url(#land-clip)');
                    var border_svg = svg.append('g').attr('id', 'border');
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
                        renderHeatHex(scope.events, projection, path);
                        // renderRoutes(scope.routes, projection, path);
                    };


                    var filterByTime = function(events) {
                        return events.filter(function(event) {
                            if(event.timeStamp > scope.timeline.dateMin && event.timeStamp < scope.timeline.dateMax) {
                                return true;
                            }
                        });
                    };

                    var renderHeatHex = function(events, projection, path) {
                        var points = [];

                        events = filterByTime(events);

                        hex_svg.selectAll(".hexagon").remove();

                        // need to go from lat_lng to x_y
                        for (var i = 0; i < events.length; i++) {
                            points.push(projection([events[i].lng, events[i].lat]));
                        }

                        var color = d3.scale.linear()
                            .domain([0, 10])
                            .range(["#ddd", "steelblue"])
                            .interpolate(d3.interpolateLab);

                        var hexbin = d3.hexbin()
                            .size([width, height])
                            .radius(hex_bin_size);

                        var hexes = hex_svg
                            .selectAll(".hexagon")
                            .data(hexbin(points));

                        hexes.enter()
                            .append("path")
                            .attr("class", "hexagon")
                            .attr("d", hexbin.hexagon())
                            .attr("transform", function(d) {
                                return "translate(" + d.x + "," + d.y + ")";
                            })
                            .style("fill", function(d) {
                                return color(d.length);
                            });

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
                        border_svg.insert("path", ".graticule")
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
                    scope.$watch('timeline', function(newVals, oldVals) {
                        scope.render(newVals);
                        return;
                    }, true);

                    scope.$watch('events', function(newVals, oldVals) {
                        scope.render(newVals);
                        return;
                    }, true);

               
                });
            }
        };
    }]);
