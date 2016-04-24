'use strict';

angular.module('ITSApp.users.identity', [])
    .factory('identity', [
        '$http',
        '$q',
        'BASE_URL',
        function ($http, $q, BASE_URL) {
            var deferred = $q.defer();
            var currentUser = undefined;

            function getCurrentUser() {
                if (currentUser) {
                    return $q.when(currentUser);
                } else {
                    return deferred.promise;
                }
            }

            function requestUserProfile() {
                var userProfileDeferred = $q.defer();

                $http.get(BASE_URL + '/users/me')
                    .then(function (response) {
                        currentUser = response.data;
                        deferred.resolve(currentUser);
                        userProfileDeferred.resolve();
                    });

                return userProfileDeferred.promise;
            }

            function removeUserProfile() {
                currentUser = undefined;
            }

            return {
                getCurrentUser: getCurrentUser,
                requestUserProfile: requestUserProfile,
                removeUserProfile: removeUserProfile
            };
        }]);
