'use strict';

angular.module('ITSApp.projects', ['ngRoute'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider
            .when('/projects', {
                templateUrl: '/app/views/projects/projects.html',
                controller: 'ProjectController'
            })
            .when('/projects/pageNumber/:pageNumber/', {
                templateUrl: '/app/views/projects/projects.html',
                controller: 'ProjectController'
            })
            .when('/projects/pageNumber/:pageNumber/filter/:value', {
                templateUrl: '/app/views/projects/projects.html',
                controller: 'ProjectController'
            })
            .when('/projects/add', {
                templateUrl: '/app/views/projects/create.html',
                controller: 'ProjectController'
            });
    }])

    .controller('ProjectController', [
        '$scope',
        '$routeParams',
        '$location',
        'projectsKnower', function ($scope, $routeParams, $location, projectKnower) {
            var totalPages = [];
            var currentPage = parseInt($routeParams.pageNumber) || 1;
            var startIndex = currentPage > 4 ? currentPage-2 : 1;
            $scope.currentPage = currentPage;

            if ($location.path().indexOf('/projects')>-1) {
                projectKnower.getAllProjects(10, currentPage)
                    .then(function (response) {
                        console.log(response);
                        $scope.projects = response;
                        debugger;
                        for (var i = startIndex; i < (((startIndex + 6) < response.TotalPages) ? (startIndex + 5) : response.TotalPages); i++) {
                            totalPages.push(i);
                        }

                        $scope.totalPages = totalPages;
                    });
            }
        }]);