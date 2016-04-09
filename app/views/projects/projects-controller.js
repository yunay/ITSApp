'use strict';

angular.module('ITSApp.projects', ['ngRoute'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider
            .when('/projects', {
                templateUrl: '/app/views/projects/projects.html',
                controller: 'ProjectController'
            })
            .when('/projects/create', {
                templateUrl: '/app/views/projects/create.html',
                controller: 'ProjectController'
            });
    }])

    .controller('ProjectController', [function () {

    }]);