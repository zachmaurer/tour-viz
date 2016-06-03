angular.module('myApp.directives.timeline', ['d3'])
    .directive('d3Timeline', ['d3Service', '$window', '$timeout', function(d3Service, $window, $timeout) {
        return {
            restrict: 'EA',
            scope: {
                events: '=',
                minDate: '=',
                maxDate: '=', // bi-directional data-binding
                timeChanged: "&"
            },
            link: function(scope, element, attrs) {
                d3Service.d3().then(function(d3) {
                    var indices = 10;
                    var items = scope.events;
                    
                    
                    var m = [30, 30, 30, 30]; //top right bottom left
                    var w = 1200 - m[1] - m[3];
                    var h = 400 - m[0] - m[2];
                    var miniHeight = indices * 12;
                    //var mainHeight = h - miniHeight - 50;

                    
                    var chart = d3.select(".timeline-container")
                        .append("svg")
                        .attr("width", w + m[1] + m[3])
                        .attr("height", h + m[0] + m[2])
                        .attr("class", "chart");
        
                    // chart.append("defs").append("clipPath")
                    //     .attr("id", "clip")
                    //     .append("rect")
                    //     .attr("width", w)
                    //     .attr("height", mainHeight);

                    // var main = chart.append("g")
                    //             .attr("transform", "translate(" + m[3] + "," + m[0] + ")")
                    //             .attr("width", w)
                    //             .attr("height", mainHeight)
                    //             .attr("class", "main");

                    var mini = chart.append("g")
                                .attr("transform", "translate(" + m[3] + "," + m[0] + ")")
                                .attr("width", w)
                                .attr("height", miniHeight)
                                .attr("class", "mini");


                    // var itemRects = main.append("g")
                    //                 .attr("clip-path", "url(#clip)");

                    scope.render = function(data) {
                        var timeBegin = d3.min(data, function(d){ return new Date(d.startDate); });
                        var timeEnd = d3.max(data, function(d){ return new Date(d.startDate); });
                        timeBegin = new Date(timeBegin.getTime() - 86400000);
                        timeEnd = new Date(timeEnd.getTime() + 86400000*15);

                            //scales
                        var timeScale = d3.time.scale()
                                .domain([timeBegin, timeEnd])
                                .range([0, w]);
                        var brushScale = d3.scale.linear()
                                .range([0, w]);
                        // var y1 = d3.scale.linear()
                        //         .domain([0, indices])
                        //         .range([0, mainHeight]);
                        var miniHeightScale = d3.scale.linear()
                                .domain([0, indices])
                                .range([0, miniHeight]);
                        var rectWidthScale = d3.scale.linear()
                                .domain([0, timeEnd.getTime() - timeBegin.getTime()])
                                .range([50, 5]);


                        chart.selectAll('.xAxis')
                            .remove();

                        var yearScale = d3.time.scale()
                                .domain([timeBegin, timeEnd])
                                .range([0, w])
                                .nice(d3.time.year);

                        var xAxis = d3.svg.axis()
                            .scale(yearScale)
                            .orient('top');

                        chart.append('g')
                            .attr('class', 'xAxis')
                            .attr("transform", "translate(" + m[3] + ","  + m[0] + ")")
                            .call(xAxis);


                        mini.selectAll("g").remove();
                        
                        //mini item rects
                        mini.append("g").selectAll("miniItems")
                            .data(data, function(d) { return d.id; })
                            .enter().append("rect")
                            .attr("class", function(d) {return (d.isSubject ? "subject" : "other");})
                            .attr("x", function(d) {return timeScale(new Date(d.startDate));})
                            .attr("y", function(d) {return miniHeightScale(d.billingIndex + .5) - 5;})
                            .attr("width", function(d) {return 5;})
                            .attr("height", 5);

                        //brush
                        var brush = d3.svg.brush()
                                            .x(timeScale)
                                            .on("brushend", display)


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
                                visItems = data.filter(function(d) {return new Date(d.startDate) < maxExtent && new Date(d.startDate) > minExtent;});
                            
                            scope.minDate = minExtent;
                            scope.maxDate = maxExtent;
    
                            $timeout(function() {
                                scope.timeChanged();
                                scope.$apply();
                            });

                            //console.log(visItems);
                            //get scale of the brush to rescale main display
                            mini.select(".brush")
                                .call(brush.extent([minExtent, maxExtent]));
                            brushScale.domain([minExtent, maxExtent]);

                            //update main item rects
                            // rects = itemRects.selectAll("rect")
                            //         .data(visItems, function(d) { return d.id; })
                            //     .attr("x", function(d) {return brushScale(new Date(d.startDate));})
                            //     .attr("width", function(d) {return rectWidthScale(maxExtent.getTime() - minExtent.getTime());});

                            // rects.enter().append("rect")
                            //     .attr("class", function(d) {return (d.isSubject ? "subject" : "other");})
                            //     .attr("x", function(d) {return brushScale(new Date(d.startDate));})
                            //     .attr("y", function(d) {return y1(d.billingIndex) + 10;})
                            //     .attr("width", function(d) {return rectWidthScale(maxExtent.getTime() - minExtent.getTime());})
                            //     .attr("height", function(d) {return 20;});

                            // rects.exit().remove();

                            //update the item labels
                            // labels = itemRects.selectAll("text")
                            //     .data(visItems, function(d) { return d.id; })
                            //     .attr("x", function(d) { return brushScale(new Date(Math.max(new Date(d.startDate).getTime(), minExtent.getTime())))-25;});

                            // labels.enter().append("text")
                            //     .text(function(d) { return d.isSubject ? "" : d.name;})
                            //     .attr("x", function(d) {return brushScale(new Date(Math.max(new Date(d.startDate).getTime(), minExtent.getTime())))-25;})
                            //     .attr("y", function(d) {return y1(d.billingIndex +0.1);})
                            //     .attr("text-anchor", "start");

                            // labels.exit().remove();
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
