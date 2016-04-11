'use strict';

angular.module('ITSApp.users.authentication', [])
.factory('authentication',['$http','$q','BASE_URL',function($http,$q,BASE_URL){
    function loginUser(user){
        var deferred = $q.defer();

        $http.post(BASE_URL+'users/login',user)
            .then(function(response){
                console.log(response.data);
                deferred.resolve(response.data);
            },function(error){

            });

        return deferred.promise;
    }

    function registerUser(user){
        var deferred = $q.defer();

        $http.post(BASE_URL+'users/register',user)
            .then(function(response){
                deferred.resolve(response.data);
            },function(error){

            });

        return deferred.promise;
    }

    function logoutUser(){

    }

    return {
        loginUser:loginUser,
        registerUser:registerUser,
        logoutUser:logoutUser
    }
}]);