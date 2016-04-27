'use strict';

angular.module('ITSApp', [
        'ngRoute',
        'ngCookies',
        'ITSApp.projects',
        'ITSApp.app.views.issue',
        'ITSApp.user',
        'ITSApp.users.identity',
        'ITSApp.app.models.projectsModel',
        'ITSApp.app.models.issuesModel',
        'ITSApp.common',
        'ITSApp.dashboard',
        'ITSApp.version',
        'ITSApp.app.common.directives.footer',
        'ITSApp.app.common.services.myNotifications'
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
    .constant('BASE_URL', 'http://softuni-issue-tracker.azurewebsites.net');