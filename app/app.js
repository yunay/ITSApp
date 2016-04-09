'use strict';

// Declare app level module which depends on views, and components
angular.module('ITSApp', [
  'ngRoute',
  'ITSApp.home',
  'ITSApp.version'
]).
config(['$routeProvider', function($routeProvider) {
  $routeProvider.otherwise({redirectTo: '/app/home'});
}]);
