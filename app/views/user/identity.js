'use strict';

angular.module('ITSApp.users.identity', [])
    .factory('identity', [
        '$http',
        '$q',
        'BASE_URL',
        function ($http, $q, BASE_URL) {
            var deferred = $q.defer(),
                currentUser = undefined;

            function getCurrentUser() {
                if (currentUser) {
                    return $q.when(currentUser);
                } else {
                    return deferred.promise;
                }
            }

            function getAllUsers() {
                var deferred = $q.defer();

                $http.get(BASE_URL + '/users')
                    .then(function (response) {
                        deferred.resolve(response.data);
                    });

                return deferred.promise;
            }

            function requestUserProfile() {
                var userProfileDeferred = $q.defer();

                $http.get(BASE_URL + '/users/me')
                    .then(function (response) {
                        currentUser = response.data;
                        deferred.resolve(currentUser);
                        userProfileDeferred.resolve(response);
                    });

                return userProfileDeferred.promise;
            }

            function removeUserProfile() {
                currentUser = undefined;
            }

            return {
                getCurrentUser: getCurrentUser,
                getAllUsers:getAllUsers,
                requestUserProfile: requestUserProfile,
                removeUserProfile: removeUserProfile
            };
        }

    ]);
