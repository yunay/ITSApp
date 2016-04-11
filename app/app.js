'use strict';

// Declare app level module which depends on views, and components
angular.module('ITSApp', [
        'ngRoute',
        'ITSApp.projects',
        'ITSApp.user',
        'ITSApp.users.identity',
        'ITSApp.common',
        'ITSApp.dashboard',
        'ITSApp.version'
    ])
    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.otherwise({redirectTo: '/projects'});
    }])
    .factory('myNotifications', [function () {
        function notify(textNotification, typeOfNotification) {
            noty({
                layout: 'topCenter',
                timeout: 3000,
                theme: 'relax',
                type: '' + typeOfNotification + '',
                text: '' + textNotification + '',
                animation: {
                    open: {height: 'toggle'},
                    close: {height: 'toggle'},
                    easing: 'swing', // easing
                    speed: 500 // opening & closing animation speed
                }
            });
        }

        return {
            notify: notify
        }
    }])
    .constant('BASE_URL', 'http://softuni-social-network.azurewebsites.net/api/');
