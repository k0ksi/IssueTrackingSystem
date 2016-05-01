'use strict';

angular.module('issueSystem.users', [
        'issueSystem.users.usersService'
    ])
    .controller('UsersController', [
        '$scope',
        'notifyService',
        function ($scope, notifyService) {
            $scope.changePassword = function (passData) {
                usersService.updatePassword(passData,
                    function success() {
                        notifyService.showInfo('You have successfully changed your password');
                    }, function error(err) {
                        notifyService.showError('You were unable to change your password', err);
                    });
            }
        }
    ]);