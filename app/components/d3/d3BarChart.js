angular.module('myApp.directives.bar', ['d3'])
    .directive('d3Bar', ['d3Service', '$window', function(d3Service, $window) {
        return {
            restrict: 'EA',
            scope: {
                artists: '=',
                venues: '=',
                test: '=',
                onMouseOver: '&' // parent execution binding
                    // label: "@"
            },
            link: function(scope, element, attrs) {
                d3Service.d3().then(function(d3) {

                    scope.renderGraphs = function() {
                        makeGraph(scope.artists, '.chart-artists', 'Artists');
                        makeGraph(scope.venues, '.chart-venues', 'Venues');
                    };

                    var makeGraph = function(data, data_type, title) {
                        var x = d3.scale.linear()
                            .domain([0, d3.max(data, function(d) {
                                return d.total;
                            })])
                            .range([0, 300]);

                        d3.select(data_type).selectAll("div").remove();
                        d3.select(data_type).selectAll("h3").remove();

                        d3.select(data_type).append('h3')
                        .text(title)
                        .attr('class', 'title');



                        var row = d3.select(data_type)
                            .selectAll("div")
                            .data(data)
                            .enter().append("div")
                            .attr('class', 'graph-row row');  

                        // Add the labels
                        var labels = row.append("div")
                            .text(function(d, i) {
                                return d.name; })
                            .attr('class', 'graph-label');

                        // add the bars
                        var bars = row.append('div')
                            .text(function(d) {
                                return d.total;
                            })
                            .attr('class', 'graph-bar')
                            .style("width", function(d) {
                                return x(d.total) + "px";
                            }); 
                    };

                    scope.renderGraphs();

                    // watch for data changes and re-render
                    scope.$watch('test', function(newVals, oldVals) {
                        scope.renderGraphs();
                        return;
                    }, true);
                });
            }
        };
    }]);
