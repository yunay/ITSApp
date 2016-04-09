'use strict';

// Declare app level module which depends on views, and components
angular.module('ITSApp', [
    'ngRoute',
    'ITSApp.projects',
    'ITSApp.user',
    'ITSApp.dashboard',
    'ITSApp.version'
]).config(['$routeProvider', function ($routeProvider) {
    $routeProvider.otherwise({redirectTo: '/projects'});
}]);
