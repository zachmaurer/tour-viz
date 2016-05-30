angular.module('myApp.directives.bubbleChart', ['d3'])
    .directive('d3BubbleChart', ['d3Service', '$window', function(d3Service, $window) {
        return {
            restrict: 'EA',
            scope: {
                events: '=', // bi-directional data-binding
                // label: "@"
            },
            link: function(scope, element, attrs) {
                d3Service.d3().then(function(d3) {
                    // Constants for sizing
                    var width = 940;
                    var height = 600;
                    var center = { x: width / 2, y: height / 2 };
                    var damper = 0.102;

                    // These will be set in create_nodes and create_vis
                    var svg = null;
                    var bubbles = null;
                    var nodes = [];

                    var charge = function(d) {
                        return -Math.pow(d.radius, 2.0) / 8;
                    };

                    var force = d3.layout.force()
                        .size([width, height])
                        .charge(charge)
                        .gravity(-0.01)
                        .friction(0.9);
                        
                    var fillColor = d3.scale.ordinal()
                          .domain(['low', 'medium', 'high'])
                          .range(['#d84b2a', '#beccae', '#7aa25c']);
                    var radiusScale = d3.scale.pow()
                      .exponent(0.5)
                      .range([2, 85]);

                    
           
                    scope.render = function(data) {
                       
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
                        //scope.render(scope.events);
                    });

                    // watch for data changes and re-render
                    scope.$watch('events', function(newVals, oldVals) {
                        //scope.render(newVals);
                        return;
                    }, true);

                });
            }
        };
    }]);
