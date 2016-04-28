'use strict';

angular.module('ITSApp.dashboard', ['ngRoute'])

    .config(['$routeProvider', function ($routeProvider) {
        var routeChecks = {
            authenticated: ['$q', 'authentication', function ($q, authentication) {
                if (authentication.isAuthenticated()) {
                    return $q.when(true);
                }

                return $q.reject('Unauthorized Access');
            }]
        };

        $routeProvider
            .when('/dashboard/', {
                templateUrl: '/app/views/dashboard/dashboard.html',
                controller: 'DashboardController',
                resolve: routeChecks.authenticated
            })
            .when('/dashboard/:pageNumber', {
                templateUrl: '/app/views/dashboard/dashboard.html',
                controller: 'DashboardController',
                resolve: routeChecks.authenticated
            })
    }])

    .controller('DashboardController', [
        '$scope',
        'issuesModel',
        'identity',
        'projectsModel',
        '$routeParams',
        function ($scope, issuesModel, identity, projectsModel, $routeParams) {
            var totalPages = [],
                currentPage = parseInt($routeParams.pageNumber) || 1,
                startIndex = currentPage > 4 ? currentPage - 2 : 1,
                allAssociatedWithMeProjects = [];

            $scope.currentPage = currentPage;
            identity.requestUserProfile()
                .then(function (response) {
                    $scope.user = response.data;
                    projectsModel.getProjectsByLeadId(response.data.Id)
                        .then(function (response) {
                            $scope.ownProjects = response;
                        });
                });

            issuesModel.getAllMyIssues(10, currentPage)
                .then(function (response) {
                    $scope.issue = response;

                    for (var i = startIndex; i <= (((startIndex + 6) < response.TotalPages) ? (startIndex + 5) : response.TotalPages); i++) {
                        totalPages.push(i);
                    }

                    $scope.totalPages = totalPages;
                });

            issuesModel.getAllMyIssues(1000, 1)
                .then(function (response) {
                    response.Issues.forEach(function (item) {
                        var isExisting = false;
                        allAssociatedWithMeProjects.forEach(function (innerItem) {
                            if (item.Project.Id === innerItem.Id) {
                                isExisting = true;
                            }
                        });
                        if (!isExisting) {
                            allAssociatedWithMeProjects.push(item.Project);
                        }
                    });
                    $scope.AssociatedProjects = allAssociatedWithMeProjects;
                });
        }]);