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

                return deferred.promise;
            }

            function registerUser(user) {
                var deferred = $q.defer();

                $http.post(BASE_URL + '/api/Account/Register', user)
                    .then(function () {
                        getAndSetAccessToken(user)
                            .then(function () {
                                refreshCookie();
                                identity.requestUserProfile()
                                    .then(function () {
                                        deferred.resolve();
                                    });
                            });
                    });

                return deferred.promise;
            }

            function loginUser(user) {
                var deferred = $q.defer();

                var userInfo = {
                    email: user.email,
                    password: user.password
                };

                getAndSetAccessToken(userInfo)
                    .then(function () {
                        refreshCookie();
                        identity.requestUserProfile()
                            .then(function () {
                                deferred.resolve();
                            });
                    });

                return deferred.promise;
            }

            function logoutUser() {
                $cookies.remove(AUTHENTICATION_COOKIE_KEY);
                $http.defaults.headers.common.Authorization = undefined;
                identity.removeUserProfile();
            }

            function isAuthenticated() {
                return !!$cookies.get(AUTHENTICATION_COOKIE_KEY);
            }

            function refreshCookie() {
                if (isAuthenticated()) {
                    $http.defaults.headers.common.Authorization = 'Bearer ' + $cookies.get(AUTHENTICATION_COOKIE_KEY);
                }
            }

            function changeUserPassword(newPass){
                //var data = 'OldPassword='+newPass.OldPassword+'&NewPassword='+newPass.NewPassword+'&ConfirmPassword='+newPass.ConfirmPassword;
                $http.post(BASE_URL+'/api/Account/ChangePassword',newPass);
            }

            return {
                loginUser: loginUser,
                registerUser: registerUser,
                logoutUser: logoutUser,
                refreshCookie: refreshCookie,
                isAuthenticated: isAuthenticated,
                changeUserPassword:changeUserPassword
            }
        }]);