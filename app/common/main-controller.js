angular.module('ITSApp.common', [])
    .controller('MainController', [
        '$scope',
        'identity',
        function ($scope, identity) {
            $scope.isAuthenticated = identity.isAuthenticated()

        }]);