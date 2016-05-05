'use strict';

angular.module('ITSApp.app.views.issue', ['ngRoute', 'ui.bootstrap'])

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
            .when('/issue/:id', {
                templateUrl: '/app/views/issue/issue.html',
                controller: 'IssueController',
                resolve: routeChecks.authenticated
            })
            .when('/issues/:id', {
                templateUrl: '/app/views/issue/edit-issue.html',
                controller: 'IssueController',
                resolve: routeChecks.authenticated
            });
    }])

    .controller('IssueController', [
        '$scope',
        '$location',
        'myNotifications',
        'issuesModel',
        'projectsModel',
        'identity',
        function ($scope, $location, myNotifications, issuesModel, projectsModel, identity) {
            var issueId = parseInt($location.path().split('/')[2]);
            var currentIssue = {},
                allUsers = allUsers || {};

            identity.requestUserProfile()
                .then(function (response) {
                    $scope.user = response.data;
                });

            issuesModel.getIssueById(issueId)
                .then(function (response) {
                    currentIssue = response;
                    response.DueDate = new Date(response.DueDate);
                    $scope.issue = response;
                    var projectId = response.Project.Id;

                    if ($location.path().match(/^(\/issue)\/\d+$/i)) {
                        issuesModel.getCommentsForIssue(issueId)
                            .then(function (response) {
                                $scope.comments = response;
                            });

                        $scope.addComment = function (comment) {
                            issuesModel.addCommentToIssue(issueId, comment)
                                .then(function (response) {
                                    $scope.comments = response;
                                })
                        };
                        $scope.changeStatus = function (status) {
                            issuesModel.changeIssueStatus(issueId, status)
                                .then(function () {
                                    location.reload();
                                });
                        }
                    } else {
                        projectsModel.getProjectById(projectId)
                            .then(function (response) {
                                $scope.projectData = response.data;
                            });

                        if (currentIssue.Labels.length > 0) {
                            var labelsArr = '';
                            currentIssue.Labels.forEach(function (label) {
                                labelsArr += label.Name + ',';
                            });
                            $scope.issue.Labels = labelsArr;
                        }
                    }

                    $scope.changeAssignee = function (input) {
                        if (input && input.length > 2) {
                            if (allUsers) {
                                identity.getAllUsers()
                                    .then(function (response) {
                                        allUsers = response;
                                        var filteredUsers = [];
                                        response.forEach(function (user) {
                                            if (user.Username.indexOf(input) > -1) {
                                                filteredUsers.push(user);
                                            }
                                        });
                                        console.log(filteredUsers);
                                        $scope.listWithallUsers = filteredUsers;
                                    });
                            } else {
                                var filteredUsers = [];
                                response.forEach(function (user) {
                                    if (user.Username.indexOf(input) > -1) {
                                        filteredUsers.push(user);
                                    }
                                });
                                console.log(filteredUsers);
                                $scope.listWithallUsers = filteredUsers;
                            }
                        }
                    };

                    $scope.replaceValue = function (user) {
                        $scope.issue.Assignee = user;
                        $scope.listWithallUsers = null;
                    };

                    $scope.editIssueBtn = function (issue) {
                        if (issue) {
                            var labels = [];
                            console.log(issue);
                            if (issue.Labels != undefined && issue.Labels.length > 0) {
                                var nativeLabels = issue.Labels.split(',');
                                var counter = 1;
                                nativeLabels.forEach(function (label) {
                                    label = label.trim();

                                    if (label && label.length > 0) {
                                        labels.push({
                                            "Id": counter,
                                            "Name": label
                                        });
                                    }

                                    counter++;
                                })
                            }

                            var editedIssue = {
                                Title: issue.Title,
                                Description: issue.Description,
                                DueDate: issue.DueDate,
                                AssigneeId: issue.Assignee.Id,
                                PriorityId: issue.Priority.Id,
                                Labels: labels
                            };

                            console.log(editedIssue);

                            issuesModel.editIssue(currentIssue.Id, editedIssue)
                                .then(function () {
                                        myNotifications.notify('The issue was edited successfully!', 'success')
                                    }, function (reason) {
                                        console.log(reason);
                                        myNotifications.notify(reason, 'error')
                                    }
                                )
                        }
                    }
                });
        }]);