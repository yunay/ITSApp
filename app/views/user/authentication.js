'use strict';

angular.module('ITSApp.users.authentication', [])
    .factory('authentication', [
        '$http',
        '$cookies',
        '$q',
        '$location',
        'identity',
        'BASE_URL',
        function ($http, $cookies, $q, $location, identity, BASE_URL) {

            var AUTHENTICATION_COOKIE_KEY = ':)_ACK';

            function getAndSetAccessToken(data) {
                var deferred = $q.defer();
                var userInfo = 'username=' + data.email + '&password=' + data.password + '&grant_type=password';

                $http.post(BASE_URL + '/api/Token', userInfo)
                    .then(function (token) {
                        var accessToken = token.data.access_token;
                        $http.defaults.headers.common.Authorization = 'Bearer ' + accessToken;
                        $cookies.put(AUTHENTICATION_COOKIE_KEY, accessToken);
                        deferred.resolve(token);
                    });
            }

            function registerUser(user) {
                $http.post(BASE_URL + '/api/Account/Register', user)
                    .then(function () {
                        getAndSetAccessToken(user);
                    });
            }

            function loginUser(user) {
                var userInfo = {
                    email: user.email,
                    password: user.password
                };

                getAndSetAccessToken(userInfo);

                //identity.requestUserProfile();
            }

            function logoutUser() {
                $cookies.remove(AUTHENTICATION_COOKIE_KEY);
                $http.defaults.headers.common.Authorization = undefined;
                identity.removeUserProfile();
                $location.path('/');
            }

            function isAuthenticated() {
                return !!$cookies.get(AUTHENTICATION_COOKIE_KEY);
            }

            function refreshCookie() {
                if (isAuthenticated()) {
                    $http.defaults.headers.common.Authorization = 'Bearer ' + $cookies.get(AUTHENTICATION_COOKIE_KEY);
                }
            }

            return {
                loginUser: loginUser,
                registerUser: registerUser,
                logoutUser: logoutUser,
                refreshCookie: refreshCookie,
                isAuthenticated: isAuthenticated
            }
        }]);