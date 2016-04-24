'use strict';

angular.module('ITSApp.user', ['ngRoute', 'ITSApp.users.authentication'])

    .config(['$routeProvider', function ($routeProvider) {
        var routeChecks = {
            authenticated: ['$q', 'authentication', function ($q, authentication) {
                if (!authentication.isAuthenticated()) {
                    return $q.when(true);
                }

                return $q.reject('Unauthorized Access');
            }]
        };

        $routeProvider
            .when('/', {
                templateUrl: '/app/views/user/user-panel.html',
                controller: 'UserController',
                resolve: routeChecks.authenticated
            })
    }])

    .controller('UserController', [
        '$scope',
        '$location',
        'myNotifications',
        'authentication',
        function ($scope, $location, myNotifications, authentication) {
            $scope.login = function (user) {
                var isEveryThingTrue = true;
                if (user == undefined || user.email.length < 1) {
                    isEveryThingTrue = false;
                    myNotifications.notify('Email is required', 'error')
                } else {
                    isEveryThingTrue = true;
                }

                if (user == undefined || user.password.length < 1) {
                    isEveryThingTrue = false;
                    myNotifications.notify('Password is required', 'error')
                } else {
                    isEveryThingTrue = true;
                }

                if (isEveryThingTrue) {
                    authentication.loginUser(user)
                        .then(function () {
                            $location.path('/dashboard');
                            myNotifications.notify('You have logged successfully!', 'success')
                        });
                }
            };

            $scope.register = function (user) {
                var isEveryThingTrue = true;
                if (user == undefined) {
                    myNotifications.notify('Please fill correctly the registration form', 'error');
                    isEveryThingTrue = false;
                } else {
                    if (user.email == undefined || user.email.length < 1) {
                        myNotifications.notify('Email is required', 'error');
                        isEveryThingTrue = false;
                    }
                    if (user.password == undefined || user.password.length < 1) {
                        myNotifications.notify('Password is required', 'error');
                        isEveryThingTrue = false;
                    } else {
                        if (user.password != user.confirmPassword) {
                            myNotifications.notify('Please confirm password correctly', 'error');
                            isEveryThingTrue = false;
                        }
                    }
                }

                if (isEveryThingTrue) {
                    authentication.registerUser(user)
                        .then(function () {
                            $location.path('/dashboard');
                            myNotifications.notify('You have successfully registered!', 'success')
                        })
                }
            };
        }]);