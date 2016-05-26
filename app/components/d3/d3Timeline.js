angular.module('myApp.directives', ['d3'])
    .directive('d3Timeline', ['d3Service', '$window', function(d3Service, $window) {
        return {
            restrict: 'EA',
            scope: {
                events: '=', // bi-directional data-binding
                routes: '=', // bi-directional data-binding
                map: '=', // bi-directional data-binding

                onMouseOver: '&', // parent execution binding
                // label: "@"
            },
            link: function(scope, element, attrs) {
                d3Service.d3().then(function(d3) {
                    var timeBegin = 0;
                    var timeEnd = 2000;
                    //var lanes = ["Chinese","Japanese","Korean","asdf", "","",""];
                    var indices = 6;
                    // var items = [{"lane": 1, "id": "Bruce", "start": 5, "end": 6},
                    //             {"lane": 2, "id": "Bruce", "start": 265, "end": 420},
                    //             {"lane": 3, "id": "Sui", "start": 580, "end": 615},
                    //             {"lane": 3, "id": "Tang", "start": 620, "end": 900},
                    //             {"lane": 3, "id": "Song", "start": 960, "end": 1265},
                    //             {"lane": 3, "id": "Yuan", "start": 1270, "end": 1365},
                    //             {"lane": 4, "id": "Ming", "start": 1370, "end": 1640},
                    //             {"lane": 5, "id": "Qing", "start": 1645, "end": 1910},             
                    //             {"lane": 6, "id": "Heisei", "start": timeBegin, "end": timeEnd},
                    //             {"lane": 6, "id": "Three Kingdoms", "start": 10, "end": 670},
                    //             {"lane": 6, "id": "North and South States", "start": 690, "end": 900},
                    //             {"lane": 2, "id": "Goryeo", "start": 920, "end": 1380},
                    //             {"lane": 2, "id": "Joseon", "start": 1390, "end": 1890},
                    //             {"lane": 2, "id": "Korean Empire", "start": 1900, "end": 1945},
                    //             {"lane": 4, "id": "Korean Empire", "start": 1645, "end": 1910}];

                    var items = [{"billingIndex": 1, "startDate": "2013-11-02", "id": "Reputante", "isSubject": 0},
                                {"billingIndex": 2, "startDate": "2013-11-02", "id": "Clementine & the Galaxy", "isSubject": 0},
                                {"billingIndex": 3, "startDate": "2013-11-02", "id": "Lolawolf", "isSubject": 0},
                                {"billingIndex": 4, "startDate": "2013-11-02", "id": "Jen Turner", "isSubject": 0},
                                {"billingIndex": 1, "startDate": "2013-11-07", "id": "The Chain Gang of 1974", "isSubject": 0},
                                {"billingIndex": 2, "startDate": "2013-11-07", "id": "Reputante", "isSubject": 0},
                                {"billingIndex": 3, "startDate": "2013-11-07", "id": "Lolawolf", "isSubject": 0},
                                {"billingIndex": 1, "startDate": "2013-11-13", "id": "Reputante", "isSubject": 0},
                                {"billingIndex": 2, "startDate": "2013-11-13", "id": "Lolawolf", "isSubject": 0},
                                {"billingIndex": 1, "startDate": "2014-01-30", "id": "Lolawolf", "isSubject": 0},
                                {"billingIndex": 2, "startDate": "2014-01-30", "id": "Reputante", "isSubject": 0},
                                {"billingIndex": 3, "startDate": "2014-01-30", "id": "Conway", "isSubject": 0},
                                {"billingIndex": 1, "startDate": "2014-02-06", "id": "Wet", "isSubject": 0},
                                {"billingIndex": 2, "startDate": "2014-02-06", "id": "Noah Breakfast", "isSubject": 0},
                                {"billingIndex": 3, "startDate": "2014-02-06", "id": "Lolawolf", "isSubject": 0},
                                {"billingIndex": 1, "startDate": "2014-02-07", "id": "Lolawolf", "isSubject": 0},
                                {"billingIndex": 2, "startDate": "2014-02-07", "id": "Reputante", "isSubject": 0},
                                {"billingIndex": 1, "startDate": "2014-02-11", "id": "Lolawolf", "isSubject": 0},
                                {"billingIndex": 1, "startDate": "2014-02-22", "id": "Lawrence Rothman", "isSubject": 0},
                                {"billingIndex": 2, "startDate": "2014-02-22", "id": "Mas Ysa", "isSubject": 0},
                                {"billingIndex": 3, "startDate": "2014-02-22", "id": "Lolawolf", "isSubject": 0},
                                {"billingIndex": 1, "startDate": "2014-03-08", "id": "Baby In Vain", "isSubject": 0},
                                {"billingIndex": 2, "startDate": "2014-03-08", "id": "Lolawolf", "isSubject": 0},
                                {"billingIndex": 3, "startDate": "2014-03-08", "id": "Boytoy", "isSubject": 0},
                                {"billingIndex": 4, "startDate": "2014-03-08", "id": "Threats", "isSubject": 0},
                                {"billingIndex": 5, "startDate": "2014-03-08", "id": "Organs", "isSubject": 0},
                                {"billingIndex": 1, "startDate": "2014-04-14", "id": "Mosco Rosco", "isSubject": 0},
                                {"billingIndex": 2, "startDate": "2014-04-14", "id": "$2 Tap Beers", "isSubject": 0},
                                {"billingIndex": 3, "startDate": "2014-04-14", "id": "$2 Drink Specials", "isSubject": 0},
                                {"billingIndex": 4, "startDate": "2014-04-14", "id": "Lolawolf", "isSubject": 0},
                                {"billingIndex": 5, "startDate": "2014-04-14", "id": "Y LUV", "isSubject": 0},
                                {"billingIndex": 6, "startDate": "2014-04-14", "id": "Bones Muhroni", "isSubject": 0},
                                {"billingIndex": 1, "startDate": "2014-05-10", "id": "Tennis", "isSubject": 0},
                                {"billingIndex": 2, "startDate": "2014-05-10", "id": "Lolawolf", "isSubject": 0},
                                {"billingIndex": 1, "startDate": "2014-05-13", "id": "The Bots", "isSubject": 0},
                                {"billingIndex": 2, "startDate": "2014-05-13", "id": "Lolawolf", "isSubject": 0},
                                {"billingIndex": 3, "startDate": "2014-05-13", "id": "Lewis Lazar", "isSubject": 0},
                                {"billingIndex": 4, "startDate": "2014-05-13", "id": "Jordan Bratton", "isSubject": 0}];

                    var m = [20, 15, 15, 120]; //top right bottom left
                    var w = 1200 - m[1] - m[3];
                    var h = 500 - m[0] - m[2];
                    var miniHeight = laneLength * 12;
                    var mainHeight = h - miniHeight - 50;

                    //scales
                    var x = d3.scale.linear()
                            .domain([timeBegin, timeEnd])
                            .range([0, w]);
                    var x1 = d3.scale.linear()
                            .range([0, w]);
                    var y1 = d3.scale.linear()
                            .domain([0, laneLength])
                            .range([0, mainHeight]);
                    var y2 = d3.scale.linear()
                            .domain([0, laneLength])
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

                    scope.render = function() {
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
                        //     .data(lanes)
                        //     .enter().append("text")
                        //     .text(function(d) {return d;})
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

                        var itemRects = main.append("g")
                                            .attr("clip-path", "url(#clip)");
                        
                        //mini item rects
                        mini.append("g").selectAll("miniItems")
                            .data(items)
                            .enter().append("rect")
                            .attr("class", function(d) {return "miniItem" + d.lane;})
                            .attr("x", function(d) {return x(d.start);})
                            .attr("y", function(d) {return y2(d.lane + .5) - 5;})
                            .attr("width", function(d) {return x(d.end - d.start);})
                            .attr("height", 10);

                        //mini labels
                        mini.append("g").selectAll(".miniLabels")
                            .data(items)
                            .enter().append("text")
                            .text(function(d) {return d.id;})
                            .attr("x", function(d) {return x(d.start);})
                            .attr("y", function(d) {return y2(d.lane + .5);})
                            .attr("dy", ".5ex");

                        //brush
                        var brush = d3.svg.brush()
                                            .x(x)
                                            .on("brush", display);

                        mini.append("g")
                            .attr("class", "x brush")
                            .call(brush)
                            .selectAll("rect")
                            .attr("y", 1)
                            .attr("height", miniHeight - 1);

                        display();
                        
                        function display() {
                            var rects, labels,
                                minExtent = brush.extent()[0],
                                maxExtent = brush.extent()[1],
                                visItems = items.filter(function(d) {return d.start < maxExtent && d.end > minExtent;});

                            mini.select(".brush")
                                .call(brush.extent([minExtent, maxExtent]));

                            x1.domain([minExtent, maxExtent]);

                            //update main item rects
                            rects = itemRects.selectAll("rect")
                                    .data(visItems, function(d) { return d.id; })
                                .attr("x", function(d) {return x1(d.start);})
                                .attr("width", function(d) {return x1(d.end) - x1(d.start);});
                            
                            rects.enter().append("rect")
                                .attr("class", function(d) {return "miniItem" + d.lane;})
                                .attr("x", function(d) {return x1(d.start);})
                                .attr("y", function(d) {return y1(d.lane) + 10;})
                                .attr("width", function(d) {return x1(d.end) - x1(d.start);})
                                .attr("height", function(d) {return .8 * y1(1);});

                            rects.exit().remove();

                            //update the item labels
                            labels = itemRects.selectAll("text")
                                .data(visItems, function (d) { return d.id; })
                                .attr("x", function(d) {return x1(Math.max(d.start, minExtent) + 2);});

                            labels.enter().append("text")
                                .text(function(d) {return d.id;})
                                .attr("x", function(d) {return x1(Math.max(d.start, minExtent));})
                                .attr("y", function(d) {return y1(d.lane + .5);})
                                .attr("text-anchor", "start");

                            labels.exit().remove();

                        }
                    };

                    // Browser onresize event
                    window.onresize = function() {
                        scope.$apply();
                    };

                    // Watch for resize event
                    scope.$watch(function() {
                        return angular.element($window)[0].innerWidth;
                    }, function() {
                        scope.render(null);
                    });

                    // watch for data changes and re-render
                    // scope.$watch('events', function(newVals, oldVals) {
                    //     scope.render(newVals);
                    //     return;
                    // }, true);

                });
            }
        };
    }]);
