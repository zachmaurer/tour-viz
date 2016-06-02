'use strict';

// Declare app level module which depends on views, and components
angular.module('myApp', [
    'ngRoute',
    'd3',
    'myApp.view1',
    'myApp.view2',
    'myApp.view3',
    'myApp.version',
    'myApp.directives.map',
    'myApp.directives.artistmap',
    'myApp.directives.timeline',
    'myApp.directives.bubbleChart',
    'myApp.directives.bar',
    'myApp.factories',
    'ui.bootstrap'
]).
config(['$routeProvider', function($routeProvider) {
    $routeProvider.otherwise({ redirectTo: '/view1' });
}]);
