angular.module('ITSApp.app.models.issuesModel', [])
    .factory('issuesModel', [
        '$http',
        '$q',
        'BASE_URL',
        function ($http, $q, BASE_URL) {

            function addIssue(issue) {
                var deferred = $q.defer();

                $http.post(BASE_URL + '/issues', issue)
                    .then(function () {
                        deferred.resolve();
                    });

                deferred.promise;
            }

            function getAllIssuesByProjectId(projectId) {
                var deferred = $q.defer();
                var issues = '';

                $http.get(BASE_URL + '/projects/' + projectId + '/issues')
                    .then(function (response) {
                        deferred.resolve(response.data);
                    });

                return deferred.promise;
            }

            function getIssueById(issueId) {
                var deferred = $q.defer();

                $http.get(BASE_URL + '/issues/' + issueId)
                    .then(function (response) {
                        deferred.resolve(response.data)
                    });

                return deferred.promise;
            }

            function getCommentsForIssue(issueId) {
                var deferred = $q.defer();

                $http.get(BASE_URL + '/issues/' + issueId + '/comments')
                    .then(function (response) {
                        deferred.resolve(response.data);
                    });

                return deferred.promise;
            }

            function addCommentToIssue(issueId,comment){
                var deferred = $q.defer();

                $http.post(BASE_URL+'/issues/'+issueId+'/comments',comment)
                    .then(function(response){
                        deferred.resolve(response.data);
                    });

                return deferred.promise;
            }

            return {
                addIssue: addIssue,
                getAllIssuesByProjectId: getAllIssuesByProjectId,
                getIssueById: getIssueById,
                getCommentsForIssue:getCommentsForIssue,
                addCommentToIssue:addCommentToIssue
            };
        }]);