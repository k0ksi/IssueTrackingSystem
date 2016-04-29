'use strict';

angular.module('issueSystem.common.dafaultSelect', [])
    .directive('dafaultSelect', [function () {
        return {
            restrict: 'A',
            link: {
                pre: function (scope, element, attrs) {
                    $(element).val(attrs.dafaultSelect);
                }
            }
        }
    }]);