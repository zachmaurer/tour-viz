angular.module('myApp.directives', ['d3'])
    .directive('d3BubbleChart', ['d3Service', '$window', function(d3Service, $window) {
        return {
            restrict: 'EA',
            scope: {
                events: '=', // bi-directional data-binding
                // label: "@"
            },
            link: function(scope, element, attrs) {
                d3Service.d3().then(function(d3) {
                    console.log("d3BubbleChart");
           

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
