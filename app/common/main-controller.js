angular.module('ITSApp.common', [])
    .controller('MainController', [
        '$scope',
        '$http',
        '$route',
        'identity',
        'authentication',
        '$timeout',
        'myNotifications',
        'BASE_URL',
        function ($scope, $http, $route, identity, authentication, $timeout, myNotifications, BASE_URL) {
            if (authentication.isAuthenticated()) {
                authentication.refreshCookie();
                $scope.isAuthenticated = true;
                identity.getCurrentUser()
                    .then(function (user) {
                        $scope.currentUser = user;
                    });
                identity.requestUserProfile();
            }

            identity.getCurrentUser()
                .then(function (user) {
                    $scope.currentUser = user;
                    $scope.isAuthenticated = true;
                });

            $scope.logout = function () {
                $scope.currentUser = undefined;
                $scope.isAuthenticated = false;
                $http.post(BASE_URL + '/api/Account/Logout', null)
                    .then(function () {
                        authentication.logoutUser();
                        myNotifications.notify('You have been logged out successfully!', 'success');
                        $timeout(function () {
                            location.reload();
                        }, 2000)
                    });
            }
        }]);