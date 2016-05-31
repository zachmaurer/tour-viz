angular.module('myApp.directives.bubbleChart', ['d3'])
    .directive('d3BubbleChart', ['d3Service', '$window', function(d3Service, $window) {
        return {
            restrict: 'EA',
            scope: {
                nodes: '=', // bi-directional data-binding
                aggregate: '=', // bi-directional data-binding
                // label: "@"
            },
            link: function(scope, element, attrs) {
                d3Service.d3().then(function(d3) {
                    console.log(scope);
                    // Constants for sizing
                    var width = 940;
                    var height = 600;
                    var center = { x: width / 2, y: height / 2 };
                    var damper = 0.102;

                    // These will be set in create_nodes and create_vis
                    var bubbles = null;

                    function chargeFn(d) {
                        return -Math.pow(d.radius, 2.0)/12;
                    };

                    var force = d3.layout.force()
                        .size([width, height])
                        .charge(chargeFn)
                        .gravity(-0.05)
                        .friction(0.9);

                    var radiusScale = d3.scale.pow()
                      .exponent(0.5)
                      .range([2, 20]);

                    var svg = d3.select('body')
                      .append('svg')
                      .attr('width', width)
                      .attr('height', height);
                    

                    function moveToCenter(alpha) {
                        return function (d) {
                          d.x = d.x + (center.x - d.x) * damper * alpha;
                          d.y = d.y + (center.y - d.y) * damper * alpha;
                        };
                    }

                    function createNodes(rawData) {
                        var nodes = rawData.map(function (d) {
                          return {
                            name: d.name,
                            count: d.count,
                            year: d.year,
                            isSubject: d.isSubject,
                            radius: radiusScale(+d.count),
                            x: (d.isSubject? center.x : 10000),
                            y: (d.isSubject? center.y : 10000)
                          };
                        });

                        // sort them to prevent occlusion of smaller nodes.
                        nodes.sort(function (a, b) { return b.value - a.value; });

                        return nodes;
                      }
           

                    //   var tip = d3.tip()
                    //       .attr('class', 'd3-tip')
                    //       .offset([-10, 0])
                    //       .html(function(d) {
                    //         var content = 
                    //         '<span class="name">Title: </span><span class="value">' +
                    //         d.name +
                    //         '</span><br/>' +
                    //         '<span class="name">Amount: </span><span class="value"># Shows:' +
                    //         d.count +
                    //         '</span><br/>' +
                    //         '<span class="name">Year: </span><span class="value">' +
                    //         d.year +
                    //         '</span>';
                    //         return content;
                    //       });
                    // svg.call(tip);


                    scope.render = function(data) {
                        var processed_data = createNodes(data);
                        force.nodes(processed_data);
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
                          .attr("class", function(d) {return (d.isSubject ? "subject" : "other");})
                          //.attr('stroke', function (d) { return d3.rgb(fillColor(d.group)).darker(); })
                          .attr('stroke-width', 2)
                          //.on('mouseover', tip.show)
                          //.on('mouseout', tip.hide);

                        bubbles.append("text")
                            .text(function (d) { return d.name; })
                            .attr("dx", -10)
                            .attr("dy", ".35em")
                            .style("stroke", "gray");

                        bubbles.selectAll('circle').transition()
                          .duration(2000)
                          .attr('r', function (d) { return d.radius; });

                        force.on('tick', function (e) {
                          bubbles.each(moveToCenter(e.alpha))
                            //.attr('cx', function (d) { return d.x; })
                            //.attr('cy', function (d) { return d.y; });
                            .attr("transform", function (d) {
        var k = "translate(" + d.x + "," + d.y + ")";
        return k;
    });
                        });

                        force.start();  
                    };

                    


                    //Browser onresize event
                    window.onresize = function() {
                        scope.$apply();
                    };

                    // // Watch for resize event
                    scope.$watch(function() {
                        return angular.element($window)[0].innerWidth;
                    }, function() {
                        //console.log(scope.nodes[0]);
                        scope.render(scope.nodes);
                    });

                    // watch for data changes and re-render
                    scope.$watch('nodes', function(newVals, oldVals) {
                        //scope.render(newVals);
                        return;
                    }, true);

                });
            }
        };
    }]);
