angular.module('myApp.directives', ['d3'])
    .directive('d3Timeline', ['d3Service', '$window', function(d3Service, $window) {
        return {
            restrict: 'EA',
            scope: {
                events: '=', // bi-directional data-binding
                // label: "@"
            },
            link: function(scope, element, attrs) {
                d3Service.d3().then(function(d3) {
                    var timeBegin = "2013-11-02";
                    var timeEnd = "2016-04-01";
                    var indices = 40;
                    var items = scope.events;
                    // var items = [{"billingIndex": 1, "startDate": "2013-11-02", "id": "Reputante", "isSubject": 0},
                    //             {"billingIndex": 2, "startDate": "2013-11-02", "id": "Clementine & the Galaxy", "isSubject": 0},
                    //             {"billingIndex": 3, "startDate": "2013-11-02", "id": "Lolawolf", "isSubject": 1},
                    //             {"billingIndex": 4, "startDate": "2013-11-02", "id": "Jen Turner", "isSubject": 0},
                    //             {"billingIndex": 1, "startDate": "2013-11-07", "id": "The Chain Gang of 1974", "isSubject": 0},
                    //             {"billingIndex": 2, "startDate": "2013-11-07", "id": "Reputante", "isSubject": 0},
                    //             {"billingIndex": 3, "startDate": "2013-11-07", "id": "Lolawolf", "isSubject": 1},
                    //             {"billingIndex": 1, "startDate": "2013-11-13", "id": "Reputante", "isSubject": 0},
                    //             {"billingIndex": 2, "startDate": "2013-11-13", "id": "Lolawolf", "isSubject": 1},
                    //             {"billingIndex": 1, "startDate": "2014-01-30", "id": "Lolawolf", "isSubject": 1},
                    //             {"billingIndex": 2, "startDate": "2014-01-30", "id": "Reputante", "isSubject": 0},
                    //             {"billingIndex": 3, "startDate": "2014-01-30", "id": "Conway", "isSubject": 0},
                    //             {"billingIndex": 1, "startDate": "2014-02-06", "id": "Wet", "isSubject": 0},
                    //             {"billingIndex": 2, "startDate": "2014-02-06", "id": "Noah Breakfast", "isSubject": 0},
                    //             {"billingIndex": 3, "startDate": "2014-02-06", "id": "Lolawolf", "isSubject": 1},
                    //             {"billingIndex": 1, "startDate": "2014-02-07", "id": "Lolawolf", "isSubject": 1},
                    //             {"billingIndex": 2, "startDate": "2014-02-07", "id": "Reputante", "isSubject": 0},
                    //             {"billingIndex": 1, "startDate": "2014-02-11", "id": "Lolawolf", "isSubject": 1},
                    //             {"billingIndex": 1, "startDate": "2014-02-22", "id": "Lawrence Rothman", "isSubject": 0},
                    //             {"billingIndex": 2, "startDate": "2014-02-22", "id": "Mas Ysa", "isSubject": 0},
                    //             {"billingIndex": 3, "startDate": "2014-02-22", "id": "Lolawolf", "isSubject": 1},
                    //             {"billingIndex": 1, "startDate": "2014-03-08", "id": "Baby In Vain", "isSubject": 0},
                    //             {"billingIndex": 2, "startDate": "2014-03-08", "id": "Lolawolf", "isSubject": 1},
                    //             {"billingIndex": 3, "startDate": "2014-03-08", "id": "Boytoy", "isSubject": 0},
                    //             {"billingIndex": 4, "startDate": "2014-03-08", "id": "Threats", "isSubject": 0},
                    //             {"billingIndex": 5, "startDate": "2014-03-08", "id": "Organs", "isSubject": 0},
                    //             {"billingIndex": 1, "startDate": "2014-04-14", "id": "Mosco Rosco", "isSubject": 0},
                    //             {"billingIndex": 2, "startDate": "2014-04-14", "id": "$2 Tap Beers", "isSubject": 0},
                    //             {"billingIndex": 3, "startDate": "2014-04-14", "id": "$2 Drink Specials", "isSubject": 0},
                    //             {"billingIndex": 4, "startDate": "2014-04-14", "id": "Lolawolf", "isSubject": 1},
                    //             {"billingIndex": 5, "startDate": "2014-04-14", "id": "Y LUV", "isSubject": 0},
                    //             {"billingIndex": 6, "startDate": "2014-04-14", "id": "Bones Muhroni", "isSubject": 0},
                    //             {"billingIndex": 1, "startDate": "2014-05-10", "id": "Tennis", "isSubject": 0},
                    //             {"billingIndex": 2, "startDate": "2014-05-10", "id": "Lolawolf", "isSubject": 1},
                    //             {"billingIndex": 1, "startDate": "2014-05-13", "id": "The Bots", "isSubject": 0},
                    //             {"billingIndex": 2, "startDate": "2014-05-13", "id": "Lolawolf", "isSubject": 1},
                    //             {"billingIndex": 3, "startDate": "2014-05-13", "id": "Lewis Lazar", "isSubject": 0},
                    //             {"billingIndex": 4, "startDate": "2014-05-13", "id": "Jordan Bratton", "isSubject": 0}];

                    var m = [20, 15, 15, 120]; //top right bottom left
                    var w = 1200 - m[1] - m[3];
                    var h = 900 - m[0] - m[2];
                    var miniHeight = indices * 12;
                    var mainHeight = h - miniHeight - 50;

                    //scales
                    var timeScale = d3.time.scale()
                            .domain([new Date(timeBegin), new Date(timeEnd)])
                            .range([0, w]);
                    var brushScale = d3.scale.linear()
                            .range([0, w]);
                    var y1 = d3.scale.linear()
                            .domain([0, indices])
                            .range([0, mainHeight]);
                    var miniHeightScale = d3.scale.linear()
                            .domain([0, indices])
                            .range([0, miniHeight]);

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
                            .data(data)
                            .enter().append("rect")
                            .attr("class", function(d) {return (d.isSubject ? "subject" : "other");})
                            .attr("x", function(d) {return timeScale(new Date(d.startDate));})
                            .attr("y", function(d) {return miniHeightScale(d.billingIndex + .5) - 5;})
                            .attr("width", function(d) {return 10;})
                            .attr("height", 10);

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

                        //display();
                        
                        function display() {
                            var rects, labels,
                                minExtent = brush.extent()[0],
                                maxExtent = brush.extent()[1],
                                visItems = data.filter(function(d) {return new Date(d.startDate) < maxExtent && new Date(d.startDate) > minExtent;});

                            mini.select(".brush")
                                .call(brush.extent([minExtent, maxExtent]));

                            brushScale.domain([minExtent, maxExtent]);

                            //update main item rects
                            rects = itemRects.selectAll("rect")
                                    .data(visItems, function(d) { return d.id; })
                                .attr("x", function(d) {return brushScale(new Date(d.startDate));})
                                .attr("width", function(d) {return 50;});
                            
                            rects.enter().append("rect")
                                .attr("class", function(d) {return (d.isSubject ? "subject" : "other");})
                                .attr("x", function(d) {return brushScale(new Date(d.startDate));})
                                .attr("y", function(d) {return y1(d.billingIndex) + 10;})
                                .attr("width", function(d) {return 50;})
                                .attr("height", function(d) {return .8 * y1(1);});

                            rects.exit().remove();

                            //update the item labels
                            labels = itemRects.selectAll("text")
                                .data(visItems, function (d) { return d.id; })
                                .attr("x", function(d) { return brushScale(new Date(Math.max(new Date(d.startDate).getTime(), minExtent.getTime())))-25;});

                            labels.enter().append("text")
                                .text(function(d) {return d.id;})
                                .attr("x", function(d) {return brushScale(new Date(Math.max(new Date(d.startDate).getTime(), minExtent.getTime())))-25;})
                                .attr("y", function(d) {return y1(d.billingIndex +0.1);})
                                .attr("text-anchor", "start");

                            labels.exit().remove();
                        }
                    };

                    // Browser onresize event
                    // window.onresize = function() {
                    //     scope.$apply();
                    // };

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
