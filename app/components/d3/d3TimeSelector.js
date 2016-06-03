angular.module('myApp.directives.timeSelector', ['d3'])
    .directive('d3Selector', ['d3Service', '$window', '$timeout', function(d3Service, $window, $timeout) {
        return {
            restrict: 'EA',
            scope: {
                minDate: '=',
                maxDate: '=', // bi-directional data-binding
                timeChanged: "&"
                // label: "@"
            },
            link: function(scope, element, attrs) {
                d3Service.d3().then(function(d3) {

                    var m = [30, 10, 30, 10]; //top right bottom left
                    var w = 960 - m[1] - m[3];
                    var h = 100;

                    var chart = d3.select(".timeline-container")
                        .append("svg")
                        .attr("width", w + m[1] + m[3])
                        .attr("height", h + m[0] + m[2])
                        .attr("class", "chart");

                        var timeBegin = new Date("1958-01-01");
                        var timeEnd = new Date("2017-01-01")

                        //scales
                        var timeScale = d3.time.scale()
                                .domain([timeBegin, timeEnd])
                                .range([0, w]);

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
                            .attr("transform", "translate(" + m[3] + "," + m[0] + ")")
                            .call(xAxis);

                        var brush = d3.svg.brush()
                            .x(timeScale)
                            .on("brush", display);


                        chart.append("g")
                            .attr("class", "x brush")
                            .call(brush)
                            .selectAll("rect")
                            //.attr("y", 20)
                            .attr("height", 50);

                        display();


                        function display() {
                            var minExtent = brush.extent()[0];
                            var maxExtent = brush.extent()[1];
                            scope.minDate = minExtent;
                            scope.maxDate = maxExtent;
                            scope.timeChanged();

                            $timeout(function() {
                             scope.$apply();
                            });
                         
                        }

                   
                    //Browser onresize event
                    window.onresize = function() {
                        scope.$apply();
                    };

                    // // Watch for resize event
                    scope.$watch(function() {
                        return angular.element($window)[0].innerWidth;
                    }, function() {
                        //console.log(scope.nodes[0]);
                        //scope.render(scope.nodes);
                    });

                    // watch for data changes and re-render
                    // scope.$watch('nodes', function(newVals, oldVals) {
                    //     //scope.render(newVals);
                    //     return;
                    // }, true);

                });
            }
        };
    }]);
