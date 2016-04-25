'use strict';

angular.module('ITSApp.views.projects.projectKnower', [])
    .factory('projectsKnower', [
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

            function editProject() {

            }

            function getProjectsByLeadId() {

            }

            function getProjectsByContains() {

            }

            return {
                getAllProjects: getAllProjects,
                addProject: addProject,
                editProject: editProject,
                getProjectsByLeadId: getProjectsByLeadId,
                getProjectsByContains: getProjectsByContains
            };
        }]);
