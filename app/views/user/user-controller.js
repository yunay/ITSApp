'use strict';

angular.module('ITSApp.user', ['ngRoute'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider
            .when('/', {
                templateUrl: '/app/views/user/user-panel.html',
                controller: 'UserController'
            })
    }])

    .controller('UserController', [
        '$scope',
        'myNotifications',
        function ($scope,myNotifications) {
            $scope.login = function(user){
                var isEveryThingTrue = true;
                if(user == undefined || user.username.length < 1){
                    isEveryThingTrue = false;
                    myNotifications.notify('Username is required','error')
                }else{
                    isEveryThingTrue = true;
                }

                if(user == undefined || user.password.length < 1) {
                    isEveryThingTrue = false;
                    myNotifications.notify('Password is required','error')
                }else{
                    isEveryThingTrue = true;
                }

                if(isEveryThingTrue){
                    console.log(user);
                }
            };

            $scope.register = function(user){
                var isEveryThingTrue = true;
                if(user == undefined){
                    myNotifications.notify('Please fill correctly the registration form','error');
                    isEveryThingTrue = false;
                }else{
                    if(user.username == undefined || user.username.length < 1){
                        myNotifications.notify('Username is required','error');
                        isEveryThingTrue = false;
                    }
                    if(user.password == undefined || user.password.length < 1){
                        myNotifications.notify('Password is required','error');
                        isEveryThingTrue = false;
                    }else{
                        if(user.password != user.confirmPassword){
                            myNotifications.notify('Please confirm password correctly','error');
                            isEveryThingTrue = false;
                        }
                    }
                    if(user.name == undefined || user.name.length < 1){
                        myNotifications.notify('Name is required','error');
                        isEveryThingTrue = false;
                    }
                    if(user.email == undefined || user.email.length < 1){
                        myNotifications.notify('Email is required','error');
                        isEveryThingTrue = false;
                    }
                }

                if(isEveryThingTrue){
                    console.log(user);
                }
            };
    }]);