'use strict';

angular.module('ITSApp', [
        'ngRoute',
        'ngCookies',
        'ITSApp.projects',
        'ITSApp.user',
        'ITSApp.users.identity',
        'ITSApp.views.projects.projectKnower',
        'ITSApp.common',
        'ITSApp.dashboard',
        'ITSApp.version'
    ])
    .config(['$routeProvider', '$httpProvider', function ($routeProvider, $httpProvider) {
        $routeProvider.otherwise({redirectTo: '/projects'});

        $httpProvider.interceptors.push(['$q', 'myNotifications', function ($q, myNotifications) {
            return {
                'responseError': function (rejection) {
                    if (rejection.data && rejection.data['error_description']) {
                        myNotifications.notify(rejection.data['error_description'], 'error');
                    }
                    else if (rejection.data && rejection.data.modelState && rejection.data.modelState['']) {
                        var errors = rejection.data.modelState[''];
                        if (errors.length > 0) {
                            myNotifications.notify(errors[0], 'error');
                        }
                    }

                    return $q.reject(rejection);
                }
            }
        }]);

    }])
    .run(['$rootScope', '$location', 'authentication', function ($rootScope, $location, authentication) {
        $rootScope.$on('$routeChangeError', function (event, current, previous, rejection) {
            if (rejection == 'Unauthorized Access') {
                $location.path('/');
            }
        });

        authentication.refreshCookie();
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
    .constant('BASE_URL', 'http://softuni-issue-tracker.azurewebsites.net');
