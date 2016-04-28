angular.module('ITSApp.app.common.directives.statusColor', [])
    .directive('statusColor', [function () {
        return {
            restrict: 'A',
            link: function (scope, element, attr) {
                scope.$watch(attr.statusColor, function (newValue) {
                    switch (newValue) {
                        case 'Open':
                            element.addClass('label label-primary');
                            break;
                        case 'Closed':
                            element.addClass('label label-danger');
                            break;
                        case 'InProgress':
                            element.addClass('label label-success');
                            break;
                        case 'StoppedProgress':
                            element.addClass('label label-warning');
                            break;
                    }
                });
            }
        }
    }]);