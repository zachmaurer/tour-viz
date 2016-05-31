angular.module('myApp.directives.timeline', ['d3'])
    .directive('d3Timeline', ['d3Service', '$window', '$timeout', function(d3Service, $window, $timeout) {
        return {
            restrict: 'EA',
            scope: {
                events: '=',
                minDate: '=',
                maxDate: '=', // bi-directional data-binding
                //timeChanged: "&"
            },
            link: function(scope, element, attrs) {
                d3Service.d3().then(function(d3) {
                    var indices = 10;
                    var items = scope.events;
                    var timeBegin = d3.min(items, function(d){ return new Date(d.startDate); });
                    var timeEnd = d3.max(items, function(d){ return new Date(d.startDate); });
                    timeBegin = new Date(timeBegin.getTime() - 86400000);
                    timeEnd = new Date(timeEnd.getTime() + 86400000*15);
                    var m = [20, 15, 15, 120]; //top right bottom left
                    var w = 1200 - m[1] - m[3];
                    var h = 400 - m[0] - m[2];
                    var miniHeight = indices * 12;
                    var mainHeight = h - miniHeight - 50;

                    //scales
                    var timeScale = d3.time.scale()
                            .domain([timeBegin, timeEnd])
                            .range([0, w]);
                    var brushScale = d3.scale.linear()
                            .range([0, w]);
                    var y1 = d3.scale.linear()
                            .domain([0, indices])
                            .range([0, mainHeight]);
                    var miniHeightScale = d3.scale.linear()
                            .domain([0, indices])
                            .range([0, miniHeight]);
                    var rectWidthScale = d3.scale.linear()
                            .domain([0, timeEnd.getTime() - timeBegin.getTime()])
                            .range([50, 5]);

                    var chart = d3.select("body")
                        .append("svg")
                        .attr("width", w + m[1] + m[3])
                        .attr("height", h + m[0] + m[2])
                        .attr("class", "chart");
        
                    chart.append("defs").append("clipPath")
                        .attr("id", "clip")
                        .append("rect")
                        .attr("width", w)
                        .attr("height", mainHeight);

                    var main = chart.append("g")
                                .attr("transform", "translate(" + m[3] + "," + m[0] + ")")
                                .attr("width", w)
                                .attr("height", mainHeight)
                                .attr("class", "main");

                    var mini = chart.append("g")
                                .attr("transform", "translate(" + m[3] + "," + (mainHeight + m[0]) + ")")
                                .attr("width", w)
                                .attr("height", miniHeight)
                                .attr("class", "mini");

                    var itemRects = main.append("g")
                                    .attr("clip-path", "url(#clip)");

                    scope.render = function(data) {
                        //main lanes and texts
                        // main.append("g").selectAll(".laneLines")
                        //     .data(items)
                        //     .enter().append("line")
                        //     .attr("x1", m[1])
                        //     .attr("y1", function(d) {return y1(d.lane);})
                        //     .attr("x2", w)
                        //     .attr("y2", function(d) {return y1(d.lane);})
                        //     .attr("stroke", "lightgray")

                        // main.append("g").selectAll(".laneText")
                        //     .data(items)
                        //     .enter().append("text")
                        //     .text(function(d) {return d.id;})
                        //     .attr("x", -m[1])
                        //     .attr("y", function(d, i) {return y1(i + .5);})
                        //     .attr("dy", ".5ex")
                        //     .attr("text-anchor", "end")
                        //     .attr("class", "laneText");
                        
                        // //mini lanes and texts
                        // mini.append("g").selectAll(".laneLines")
                        //     .data(items)
                        //     .enter().append("line")
                        //     .attr("x1", m[1])
                        //     .attr("y1", function(d) {return y2(d.lane);})
                        //     .attr("x2", w)
                        //     .attr("y2", function(d) {return y2(d.lane);})
                        //     .attr("stroke", "lightgray");

                        // mini.append("g").selectAll(".laneText")
                        //     .data(lanes)
                        //     .enter().append("text")
                        //     .text(function(d) {return d;})
                        //     .attr("x", -m[1])
                        //     .attr("y", function(d, i) {return y2(i + .5);})
                        //     .attr("dy", ".5ex")
                        //     .attr("text-anchor", "end")
                        //     .attr("class", "laneText");

                        
                        
                        //mini item rects
                        mini.append("g").selectAll("miniItems")
                            .data(data, function(d) { return d.id; })
                            .enter().append("rect")
                            .attr("class", function(d) {return (d.isSubject ? "subject" : "other");})
                            .attr("x", function(d) {return timeScale(new Date(d.startDate));})
                            .attr("y", function(d) {return miniHeightScale(d.billingIndex + .5) - 5;})
                            .attr("width", function(d) {return 5;})
                            .attr("height", 5);

                        //mini labels
                        // mini.append("g").selectAll(".miniLabels")
                        //     .data(items)
                        //     .enter().append("text")
                        //     .text(function(d) {return d.id;})
                        //     .attr("x", function(d) {return timeScale(new Date(d.startDate));})
                        //     .attr("y", function(d) {return miniHeightScale(d.billingIndex + .5);})
                        //     .attr("dy", ".5ex");

                        //brush
                        var brush = d3.svg.brush()
                                            .x(timeScale)
                                            .on("brush", display);

                        mini.append("g")
                            .attr("class", "x brush")
                            .call(brush)
                            .selectAll("rect")
                            .attr("y", 1)
                            .attr("height", miniHeight - 1);

                        display();
                        //console.log("rendinger");
                        function display() {
                            var rects, labels,
                                minExtent = brush.extent()[0],
                                maxExtent = brush.extent()[1],
                                visItems = data.filter(function(d) {return new Date(d.startDate) < maxExtent && new Date(d.startDate) > minExtent;});
                            
                            scope.minDate = minExtent;
                            scope.maxDate = maxExtent;
                            console.log(minExtent);
                            console.log(maxExtent);
                            console.log(scope);

                            $timeout(function() {
                             scope.$apply();
                            });

                            //console.log(visItems);
                            //get scale of the brush to rescale main display
                            mini.select(".brush")
                                .call(brush.extent([minExtent, maxExtent]));
                            brushScale.domain([minExtent, maxExtent]);

                            //update main item rects
                            rects = itemRects.selectAll("rect")
                                    .data(visItems, function(d) { return d.id; })
                                .attr("x", function(d) {return brushScale(new Date(d.startDate));})
                                .attr("width", function(d) {return rectWidthScale(maxExtent.getTime() - minExtent.getTime());});
                            
                            //console.log(minExtent);
                            //console.log(maxExtent);
                            //console.log(visItems.length);

                            rects.enter().append("rect")
                                .attr("class", function(d) {return (d.isSubject ? "subject" : "other");})
                                .attr("x", function(d) {return brushScale(new Date(d.startDate));})
                                .attr("y", function(d) {return y1(d.billingIndex) + 10;})
                                .attr("width", function(d) {return rectWidthScale(maxExtent.getTime() - minExtent.getTime());})
                                .attr("height", function(d) {return 20;});

                            rects.exit().remove();

                            //update the item labels
                            labels = itemRects.selectAll("text")
                                .data(visItems, function(d) { return d.id; })
                                .attr("x", function(d) { return brushScale(new Date(Math.max(new Date(d.startDate).getTime(), minExtent.getTime())))-25;});

                            labels.enter().append("text")
                                .text(function(d) {return d.name;})
                                .attr("x", function(d) {return brushScale(new Date(Math.max(new Date(d.startDate).getTime(), minExtent.getTime())))-25;})
                                .attr("y", function(d) {return y1(d.billingIndex +0.1);})
                                .attr("text-anchor", "start");

                            labels.exit().remove();
                        }
                    };

                    //Browser onresize event
                    window.onresize = function() {
                        scope.$apply();
                    };

                    // // Watch for resize event
                    scope.$watch(function() {
                        return angular.element($window)[0].innerWidth;
                    }, function() {
                        //console.log(scope.data[0]);
                        scope.render(scope.events);
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
