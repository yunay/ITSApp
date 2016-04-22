'use strict';

angular.module('ITSApp.dashboard', ['ngRoute'])

    .config(['$routeProvider', function ($routeProvider) {
        var routeChecks = {
            authenticated: ['$q', 'authentication', function ($q, authentication) {
                if (authentication.isAuthenticated()) {
                    return $q.when(true);
                }

                return $q.reject('Unauthorized Access');
            }]
        };

        $routeProvider
            .when('/dashboard', {
                templateUrl: '/app/views/dashboard/dashboard.html',
                controller: 'DashboardController',
                resolve: routeChecks.authenticated
            })
    }])

    .controller('DashboardController', [function () {

    }]);