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

    .controller('ProjectController', ['$scope', '$location', 'projectsKnower', function ($scope, $location, projectKnower) {
        if ($location.path() == '/projects') {
            projectKnower.getAllProjects(10, 1)
                .then(function (response) {
                    console.log(response);
                    $scope.projects = response;
                });
        }


    }]);