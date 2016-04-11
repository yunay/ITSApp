'use strict';

angular.module('ITSApp.users.identity', [])
    .factory('identity', [
        '$http',
        'BASE_URL',
        function ($http, BASE_URL) {
            var token = "eHwIu0CqWjjS-Nmxij96fS30OP-APtBzVo4z7hyv3ZFK7bjSb0E-5sJTFiWHx7_56HhbwFCb_zssAwr3yXO5JqrMSzc2IqeZPTS2MKyshbXWbCDki6yFR1KKgDmDUFzKlTE_ZGQfXF466aUQl7k9d1Ja7zwbLe6LIwDu8XEKJitevxit4cmGP6ko-OyeE4dnMF_oelj5y4-WlZ_xQjmQjElf_JjxCNOiPPtcGhznP8FiGxuMA9T1XdVQbo37ewFFkc6kyw8s7nyc66Bd5nybI1i8V_tcauVPYCUIuZIbVi9wqrts4uRV74SU9h7Z_9pWR6uijfSqU4beGMFGDTWQdCo_gx4h2cKmAKW-tH-MGLS5NLXyz9TxDHMQM26i18YoPysEfaFUdFuvkJAxr2BtQwYe7EBA5aBJmuzRuTrPYPWsPXTGKuuzMhajfny21eMozZzn9C9aPxUghssT8-dfAUElcgukbGr4HTdMeM2YSELJ3OgDU8TR-SaZsimJQ9Mo";
            var username = "yunayy";
            //TODO

            $http.defaults.headers.common.Authorization = 'Bearer ' + token;

            $http.get(BASE_URL + 'me')
                .then(function (response) {
                    console.log(response.data)
                });

            var currentUser = $http.get('')
                .then(function () {

                });


            function getCurrentUser() {
                if (!currentUser) {
                    //TODO
                } else {

                }

                return {
                    username: username
                };
            }

            function isAuthenticated() {
                //TODO
                return true;
            }

            return {
                getCurrentUser: getCurrentUser,
                isAuthenticated: isAuthenticated
            };
        }]);
