angular.module('ITSApp.common', [])
    .controller('MainController', [
        '$scope',
        '$route',
        'identity',
        'authentication',
        function ($scope,$route, identity, authentication) {
            if(authentication.isAuthenticated()){
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
                authentication.logoutUser();
                location.reload();
            }
        }]);