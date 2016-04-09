'use strict';

angular.module('ITSApp.user', ['ngRoute'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider
            .when('/', {
                templateUrl: '/app/views/user/user-panel.html',
                controller: 'UserController'
            })
    }])

    .controller('UserController', [function () {

    }]);