'use strict';

angular.module('issueSystem.common.defaultSelect', [])
    .directive('defaultSelect', [function () {
        return {
            restrict: 'A',
            link: {
                pre: function (scope, element, attrs) {
                    $('#' + attrs.id).val(2);
                }
            }
        }
    }]);