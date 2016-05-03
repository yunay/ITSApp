'use strict';

angular.module('ITSApp.projects', ['ngRoute', 'ui.bootstrap'])

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
            .when('/projects', {
                templateUrl: '/app/views/projects/projects.html',
                controller: 'ProjectController',
                resolve: routeChecks.authenticated
            })
            .when('/projects/pageNumber/:pageNumber/', {
                templateUrl: '/app/views/projects/projects.html',
                controller: 'ProjectController',
                resolve: routeChecks.authenticated
            })
            .when('/projects/pageNumber/:pageNumber/filter/:value', {
                templateUrl: '/app/views/projects/projects.html',
                controller: 'ProjectController',
                resolve: routeChecks.authenticated
            })
            .when('/projects/add', {
                templateUrl: '/app/views/projects/partials/create.html',
                controller: 'ProjectController',
                resolve: routeChecks.authenticated
            })
            .when('/projects/:id', {
                templateUrl: '/app/views/projects/projectId.html',
                controller: 'ProjectController',
                resolve: routeChecks.authenticated
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
        function ($scope, $uibModal, $routeParams, $location, identity, projectsModel, issuesModel) {
            var totalPages = [],
                currentPage = parseInt($routeParams.pageNumber) || 1,
                startIndex = currentPage > 4 ? currentPage - 2 : 1;

            $scope.currentPage = currentPage;

            //TODO:Filter
            if ($location.path().match(/^(\/projects)$/i) || $location.path().indexOf('pageNumber') > -1) {
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
                    templateUrl: '/app/views/projects/partials/create.html',
                    controller: 'ModalInstanceCtrl',
                    resolve: {
                        project: function () {
                            return $scope.project;
                        }
                    }
                });
            };

            $scope.editProjectModalForm = function () {
                $uibModal.open({
                    templateUrl: '/app/views/projects/partials/edit.html',
                    controller: 'ModalInstanceCtrl',
                    resolve: {
                        project: function () {
                            return $scope.project;
                        }
                    }
                });
            };

            $scope.addIssueModalForm = function () {
                $uibModal.open({
                    templateUrl: '/app/views/projects/partials/addIssue.html',
                    controller: 'ModalInstanceIssueCtrl',
                    resolve: {
                        issue: function () {
                            return $scope.issue;
                        }
                    }
                });
            };

            if ($location.path().match(/^(\/projects)\/\d+$/i)) {
                var projectId = parseInt($location.path().split('/')[2]),
                    currentUser = {};

                projectsModel.getProjectById(projectId)
                    .then(function (response) {
                        $scope.project = response.data;
                    });

                identity.requestUserProfile()
                    .then(function (response) {
                        currentUser = response.data;
                        $scope.currentUser = currentUser;

                        issuesModel.getAllIssuesByProjectId(projectId)
                            .then(function (response) {
                                var assignedIssues = [];
                                response.forEach(function (issue) {
                                    if (currentUser.Id == issue.Assignee.Id) {
                                        console.log(issue);
                                        assignedIssues.push(issue)
                                    }
                                });
                                $scope.issues = assignedIssues;
                            });
                    });

                $scope.allIssues = function () {
                    issuesModel.getAllIssuesByProjectId(projectId)
                        .then(function (response) {
                            console.log(response);
                            $scope.issues = response;
                        });
                };

                $scope.assignedIssues = function(){
                    issuesModel.getAllIssuesByProjectId(projectId)
                        .then(function (response) {
                            var assignedIssues = [];
                            response.forEach(function (issue) {
                                if (currentUser.Id == issue.Assignee.Id) {
                                    console.log(issue);
                                    assignedIssues.push(issue)
                                }
                            });
                            $scope.issues = assignedIssues;
                        });
                };
            }
        }]);

angular.module('ITSApp.projects').controller('ModalInstanceIssueCtrl', [
    '$scope',
    '$uibModalInstance',
    'issuesModel',
    '$location',
    'projectsModel',
    'myNotifications',
    'identity',
    function ($scope, $uibModalInstance, issuesModel, $location, projectsModel, myNotifications, identity) {
        var projectId = parseInt($location.path().split('/')[2]);

        projectsModel.getProjectById(projectId)
            .then(function (response) {
                $scope.projectPriorities = response.data.Priorities;
            });

        identity.getAllUsers()
            .then(function (response) {
                $scope.listWithallUsers = response;
            });

        $scope.closeForm = function () {
            $uibModalInstance.close('cancel');
        };

        $scope.addIssue = function (issue) {
            var labels = [];

            if (issue.labels != undefined && issue.labels.length > 0) {
                var nativeLabels = issue.labels.split(',');
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

            var newIssue = {
                Title: issue.title,
                Description: issue.description,
                DueDate: issue.dueDate,
                ProjectId: projectId,
                AssigneeId: issue.assigneeId,
                PriorityId: issue.priorityId,
                Labels: labels
            };

            console.log(newIssue);

            issuesModel.addIssue(newIssue);
            $uibModalInstance.close('cancel');
            myNotifications.notify('Your issue was added successfully!', 'success');
        };
    }]);

angular.module('ITSApp.projects').controller('ModalInstanceCtrl', [
    '$scope',
    '$uibModalInstance',
    'projectsModel',
    'myNotifications',
    'identity',
    function ($scope, $uibModalInstance, projectsModel, myNotifications, identity) {

        $scope.closeForm = function () {
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

            if (project.priorities != undefined && project.priorities.length > 0) {
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

            projectsModel.addProject(newProject);
            $uibModalInstance.close('cancel');
            myNotifications.notify('Your project was added successfully!', 'success');
        };
    }]);

angular.module('ITSApp.projects').controller('ModalInstanceCtrl', [
    '$scope',
    '$uibModalInstance',
    'projectsModel',
    'myNotifications',
    '$location',
    'identity',
    function ($scope, $uibModalInstance, projectsModel, myNotifications, $location, identity) {
        var projectId = parseInt($location.path().split('/')[2]);
        $scope.project = projectsModel.getProjectById(projectId)
            .then(function (response) {
                var labels = '';
                var priorities = '';

                if (response.data.Labels.length > 0) {
                    response.data.Labels.forEach(function (label) {
                        labels += label.Name + ',';
                    })
                }
                if (response.data.Priorities.length > 0) {
                    response.data.Priorities.forEach(function (priority) {
                        priorities += priority.Name + ',';
                    })
                }

                response.data.Labels = labels;
                response.data.Priorities = priorities;
                console.log(response.data);
                $scope.project = response.data;
            });


        $scope.closeForm = function () {
            $uibModalInstance.close('cancel');
        };

        $scope.editProject = function (project) {
            var currentUser = identity.getCurrentUser(),
                labels = [],
                priorities = [];

            if (project.Labels != undefined && project.Labels.length > 0) {
                var nativeLabels = project.Labels.split(',');
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

            if (project.Priorities != undefined && project.Priorities.length > 0) {
                var nativePriorities = project.Priorities.split(',');
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

            var editedProject = {
                Name: project.Name,
                Description: project.Description,
                labels: labels,
                priorities: priorities,
                LeadId: currentUser.$$state.value.Id
            };

            console.log(editedProject);

            projectsModel.editProject(editedProject, projectId);
            $uibModalInstance.close('cancel');
            myNotifications.notify('Your project was edited successfully!', 'success');
        };
    }]);