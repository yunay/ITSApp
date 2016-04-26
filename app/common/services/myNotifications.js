angular.module('ITSApp.app.common.services.myNotifications', [])
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
    }]);