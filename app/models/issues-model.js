angular.module('ITSApp.app.models.issuesModel', [])
    .factory('issuesModel', [
        '$http',
        '$q',
        'BASE_URL',
        function ($http, $q, BASE_URL) {

            function getAllIssuesByProjectId(projectId) {
                var deferred = $q.defer();
                var issues = '';

                $http.get(BASE_URL + '/projects/'+projectId+'/issues')
                    .then(function (response) {
                        deferred.resolve(response.data);
                    });

                return deferred.promise;
            }

            return {
                getAllIssuesByProjectId: getAllIssuesByProjectId
            };
        }]);