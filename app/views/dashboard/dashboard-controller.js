'use strict';

angular.module('ITSApp.dashboard', ['ngRoute'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider
            .when('/dashboard', {
                templateUrl: '/app/views/dashboard/dashboard.html',
                controller: 'DashboardController'
            })
    }])

    .controller('DashboardController', [function () {

    }]);