'use strict';

angular.module('ITSApp.home', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/', {
    templateUrl: '/app/home/home.html',
    controller: 'HomeController'
  });
}])

.controller('HomeController', [function() {

}]);