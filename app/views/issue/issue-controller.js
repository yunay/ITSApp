'use strict';

angular.module('ITSApp.home', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/', {
    templateUrl: '/app/views/projects/projects.html',
    controller: 'HomeController'
  });
}])

.controller('HomeController', [function() {

}]);