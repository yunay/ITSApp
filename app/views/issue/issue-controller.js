'use strict';

angular.module('ITSApp.app.views.issue', ['ngRoute', 'ui.bootstrap'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/issue/:id', {
            templateUrl: '/app/views/issue/issue.html',
            controller: 'IssueController'
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
                console.log(comment);
                issuesModel.addCommentToIssue(issueId, comment)
                    .then(function (response) {
                        $scope.comments = response;
                    })
            };

            identity.requestUserProfile()
                .then(function (response) {
                    console.log(response);

                    $scope.user = response.data;
                })
        }]);