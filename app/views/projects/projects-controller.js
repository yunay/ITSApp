'use strict';

angular.module('ITSApp.projects', ['ngRoute', 'ui.bootstrap'])

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
            })
            .when('/projects/:id', {
                templateUrl: '/app/views/projects/projectId.html',
                controller: 'ProjectController'
            });
    }])

    .controller('ProjectController', [
        '$scope',
        '$uibModal',
        '$routeParams',
        '$location',
        'identity',
        'projectsModel',
        'issuesModel',
        function ($scope, $uibModal, $routeParams, $location, identity, projectsModel,issuesModel) {
            var totalPages = [],
                currentPage = parseInt($routeParams.pageNumber) || 1,
                startIndex = currentPage > 4 ? currentPage - 2 : 1;

            $scope.currentPage = currentPage;

            //Listing all projects with paging
            //TODO:Filter
            if ($location.path().match(/^(\/projects)$/i) || $location.path().indexOf('pageNumber')>-1) {
                console.log('first');
                projectsModel.getAllProjects(10, currentPage)
                    .then(function (response) {
                        $scope.projects = response;
                        for (var i = startIndex; i <= (((startIndex + 6) < response.TotalPages) ? (startIndex + 5) : response.TotalPages); i++) {
                            totalPages.push(i);
                        }

                        $scope.totalPages = totalPages;
                    });
            }

            $scope.addProjectModalForm = function () {
                $uibModal.open({
                    templateUrl: '/app/views/projects/create.html',
                    controller: 'ModalInstanceCtrl',
                    resolve: {
                        project: function () {
                            return $scope.project;
                        }
                    }
                });
            };

            if ($location.path().match(/^(\/projects)\/\d+$/i)) {
                var projectId = parseInt($location.path().split('/')[2]);

                projectsModel.getProjectById(projectId)
                    .then(function (response) {
                        $scope.project = response.data;
                    });

                issuesModel.getAllIssuesByProjectId(projectId)
                    .then(function(response){
                        $scope.issues = response;
                    });

                identity.requestUserProfile()
                    .then(function(response){
                        $scope.currentUser = response.data;
                    });
            }
        }]);

angular.module('ITSApp.projects').controller('ModalInstanceCtrl', [
    '$scope',
    '$uibModalInstance',
    'projectsKnower',
    'myNotifications',
    'identity',
    function ($scope, $uibModalInstance, projectsKnower, myNotifications, identity) {

        $scope.closeForm = function () {
            console.log('close');
            $uibModalInstance.close('cancel');
        };

        $scope.addProject = function (project) {
            var currentUser = identity.getCurrentUser(),
                labels = [],
                priorities = [];

            if (project.labels != undefined && project.labels.length > 0) {
                var nativeLabels = project.labels.split(',');
                var counter = 1;
                nativeLabels.forEach(function (label) {
                    label = label.trim();
                    labels.push({
                        "Id": counter,
                        "Name": label
                    });
                    counter++;
                })
            }

            if (project.labels != undefined && project.priorities.length > 0) {
                var nativePriorities = project.priorities.split(',');
                var counter = 1;
                nativePriorities.forEach(function (priority) {
                    priority = priority.trim();
                    priorities.push({
                        "Id": counter,
                        "Name": priority
                    });
                    counter++;
                })
            }

            var newProject = {
                Name: project.name,
                Description: project.description,
                ProjectKey: project.projectKey,
                labels: labels,
                priorities: priorities,
                LeadId: currentUser.$$state.value.Id
            };

            projectsKnower.addProject(newProject);
            $uibModalInstance.close('cancel');
            myNotifications.notify('Your project was added successfully!', 'success');
        };
    }]);