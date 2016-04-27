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
        function ($scope, $location, issuesModel) {
            var issueId = parseInt($location.path().split('/')[2]);

            issuesModel.getIssueById(issueId)
                .then(function (response) {
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
            }
        }]);