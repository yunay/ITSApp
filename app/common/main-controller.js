angular.module('ITSApp.common', [])
    .controller('MainController', [
        '$scope',
        'authentication',
        function ($scope, authentication) {
            //identity.getCurrentUser()
            //    .then(function (user) {
            //        $scope.currentUser = user;
            //    });

            $scope.isAuthenticated = authentication.isAuthenticated()
        }]);