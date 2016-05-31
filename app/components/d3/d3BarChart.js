angular.module('myApp.directives.bar', ['d3'])
    .directive('d3Bar', ['d3Service', '$window', function(d3Service, $window) {
        return {
            restrict: 'EA',
            scope: {
                artists: '=',
                venues: '=',
                onMouseOver: '&' // parent execution binding
                    // label: "@"
            },
            link: function(scope, element, attrs) {
                d3Service.d3().then(function(d3) {


                    scope.renderGraphs = function() {
                        makeGraph(scope.artists, '.chart-artists');
                        makeGraph(scope.venues, '.chart-venues');
                    };

                    var makeGraph = function(data, data_type) {
                        var x = d3.scale.linear()
                            .domain([0, d3.max(data)])
                            .range([0, 200]);


                        d3.select(data_type)
                            .selectAll("div")
                            .data(data)
                            .enter().append("div")
                            .style("width", function(d) {
                                return x(d) + "px";
                            })
                            .text(function(d) {
                                return d;
                            });
                    };


                    scope.renderGraphs();

                    // watch for data changes and re-render
                    scope.$watch('artists', function(newVals, oldVals) {
                        scope.renderGraphs(newVals);
                        return;
                    }, true);
                });
            }
        };
    }]);
