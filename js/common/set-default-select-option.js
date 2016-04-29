'use strict';

angular.module('issueSystem.common.dafaultSelect', [])
    .directive('dafaultSelect', [function () {
        return {
            restrict: 'A',
            link: function (scope, element, attrs) {
                $(element).val(attrs);
            }
        }
    }]);