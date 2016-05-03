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

        $routeProvider.when('/issue/:id', {
            templateUrl: '/app/views/issue/issue.html',
            controller: 'IssueController',
            resolve: routeChecks.authenticated
        });
    }])

    .controller('IssueController', [
        '$scope',
        '$location',
        'issuesModel',
        'identity',
        function ($scope, $location, issuesModel, identity) {
            var issueId = parseInt($location.path().split('/')[2]);

            issuesModel.getIssueById(issueId)
                .then(function (response) {
                    console.log(response);

                    $scope.issue = response;
                });

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

            identity.requestUserProfile()
                .then(function (response) {
                    console.log(response);

                    $scope.user = response.data;
                });

            $scope.changeStatus = function (status) {
                issuesModel.changeIssueStatus(issueId, status)
                    .then(function () {
                        location.reload();
                    });
            }
        }]);