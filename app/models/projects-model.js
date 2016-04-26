angular.module('ITSApp.app.models.projectsModel', [])
    .factory('projectsModel', [
        '$http',
        '$q',
        'BASE_URL',
        function ($http, $q, BASE_URL) {

            function getAllProjects(pageSize, pageNumber) {
                var deferred = $q.defer();
                var projects = '';

                $http.get(BASE_URL + '/projects?filter=&pageSize=' + pageSize + '&pageNumber=' + pageNumber + '')
                    .then(function (response) {
                        deferred.resolve(response.data);
                    });

                return deferred.promise;
            }

            function addProject(newProject) {
                var deferred = $q.defer();

                $http.post(BASE_URL + '/projects', newProject)
                    .then(function (response) {
                        deferred.resolve(response);
                    });

                return deferred.promise;
            }

            function getProjectById(id) {
                var deferred = $q.defer();

                $http.get(BASE_URL + '/projects/' + id)
                    .then(function (response) {
                        deferred.resolve(response);
                    });

                return deferred.promise;
            }

            function editProject(editedProject,projectId) {
                var deferred = $q.defer();

                $http.put(BASE_URL + '/projects/'+projectId, editedProject)
                    .then(function (response) {
                        deferred.resolve(response);
                    });

                return deferred.promise;
            }

            function getProjectsByLeadId() {

            }

            function getProjectsByContains() {

            }

            return {
                getAllProjects: getAllProjects,
                addProject: addProject,
                getProjectById:getProjectById,
                editProject: editProject,
                getProjectsByLeadId: getProjectsByLeadId,
                getProjectsByContains: getProjectsByContains
            };
        }]);