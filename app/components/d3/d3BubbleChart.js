angular.module('myApp.directives.bubbleChart', ['d3'])
    .directive('d3BubbleChart', ['d3Service', '$window', '$timeout', function(d3Service, $window, $timeout) {
        return {
            restrict: 'EA',
            scope: {
                nodes: '=',
                minDate: '=',
                maxDate: '=', // bi-directional data-binding
                timeline: '=',
                test: '=',
                label: "&",
                labelartist: '='
            },
            link: function(scope, element, attrs) {
                d3Service.d3().then(function(d3) {

                    // Constants for sizing
                    var width = 500;
                    var height = 480;
                    var center = { x: width / 2, y: height / 2 };
                    var damper = 0.102;

                    // These will be set in create_nodes and create_vis
                    var bubbles = null;

                    function chargeFn(d) {
                        return -Math.pow(d.radius, 2.0) / 12;
                    };

                    var force = d3.layout.force()
                        .size([width, height])
                        .charge(chargeFn)
                        .gravity(-0.05)
                        .friction(0.9);

                    var radiusScale = d3.scale.linear()
                        .range([2, 70]);

                    var svg = d3.select('.bubble-container')
                        .append('svg')
                        .attr('id', 'bubbleChart')
                        .attr('width', width)
                        .attr('height', height);


                    function moveToCenter(alpha) {
                        return function(d) {
                            d.x = d.x + (center.x - d.x) * damper * alpha;
                            d.y = d.y + (center.y - d.y) * damper * alpha;
                        };
                    }

                    function createNodes(rawData) {


                        var nodes = rawData.map(function(d) {
                            return {
                                name: d.name,
                                count: d.count,
                                events: d.events,
                                isSubject: d.isSubject,
                                radius: d.isSubject ? 120 : (radiusScale(d.count) > 0 ? radiusScale(d.count) : 0),
                                x: (d.isSubject ? center.x : 200),
                                y: (d.isSubject ? center.y : 200)
                            };

                        });

                        // sort them to prevent occlusion of smaller nodes.
                        nodes.sort(function(a, b) {
                            return b.count - a.count;
                        });

                        return nodes;
                    }


                    var filterByTime = function(data) {
                        for (var i in data) {
                            var artist = data[i];
                            artist.count = artist.events.length;
                            for (var j in artist.events) {
                                var event_time = artist.events[j];
                                if (event_time < scope.timeline.dateMin || event_time > scope.timeline.dateMax) {
                                    artist.count--;
                                }
                            }
                        }
                        return data;
                    };

                    scope.render = function() {

                        data = filterByTime(scope.nodes);

                        var maxShows = d3.max(data, function(d) {
                            return d.isSubject ? 0 : d.count;
                        });
                        radiusScale.domain([1, maxShows]);
                        var processed_data = createNodes(data);
                        force.nodes(processed_data);

                        svg.selectAll('g').remove();

                        bubbles = svg.selectAll('.bubble')
                            .data(processed_data);

                        bubbles.enter()
                            .append("g")
                            .call(force.drag);

                        // Create new circle elements each with class `bubble`.
                        // There will be one circle.bubble for each object in the nodes array.
                        // Initially, their radius (r attribute) will be 0.
                        bubbles.append('circle')
                            .classed('bubble', true)
                            .attr('r', 0)
                            //.attr('fill', function(d) {return (d.isSubject ? "darksalmon" : "slategray");} )
                            .attr("class", function(d) {
                                return (d.isSubject ? "subject" : "other");
                            })
                            //.attr('stroke', function (d) { return d3.rgb(fillColor(d.group)).darker(); })
                            .attr('stroke-width', 2)
                            .on('mouseover', function(d) {
                                return scope.label({ item: d });
                            })
                            .on('mouseleave', function(d) {
                                return scope.label({ item: null });
                            });

                        //.on('mouseout', tip.hide);

                        bubbles.append("text")
                            .classed('bubble', true)
                            .text(function(d) {
                                return (d.radius < 10) ? "" : d.name;
                            })
                            .attr("dx", -10)
                            .attr("dy", ".35em")
                            .style("stroke", "gray");

                        bubbles.selectAll('circle')
                            // .transition()
                            //     .duration(2000)
                            .attr('r', function(d) {
                                return d.radius;
                            });

                        force.on('tick', function(e) {
                            bubbles.each(moveToCenter(e.alpha))
                                //.attr('cx', function (d) { return d.x; })
                                //.attr('cy', function (d) { return d.y; });
                                .attr("transform", function(d) {
                                    var k = "translate(" + d.x + "," + d.y + ")";
                                    return k;
                                });
                        });

                        force.start();
                    };


                    // scope.filterByTime = function() {
                    //     bubbles.each(function(d) {
                    //         for(x )
                    //     });
                    // };

                    //Browser onresize event
                    window.onresize = function() {
                        scope.$apply();
                    };

                    // // Watch for resize event
                    // scope.$watch(function() {
                    //     return angular.element($window)[0].innerWidth;
                    // }, function() {
                    //     //console.log(scope.nodes[0]);
                    //     scope.render();
                    // });

                    // // watch for data changes and re-render
                    // scope.$watch('nodes', function(newVals, oldVals) {
                    //     scope.render();
                    //     return;
                    // }, true);

                    scope.$watch('test', function(newVals, oldVals) {
                        scope.render();
                        return;
                    }, true);

                });
            }
        };
    }]);
