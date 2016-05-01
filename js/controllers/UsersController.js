'use strict';

angular.module('issueSystem.users', [
        'issueSystem.users.usersService'
    ])
    .controller('UsersController', [
        '$scope',
        '$location',
        'usersService',
        'notifyService',
        function ($scope, $location, usersService, notifyService) {
            $scope.changePassword = function (passData) {
                usersService.updatePassword(passData,
                    function success() {
                        notifyService.showInfo('You have successfully changed your password');
                        $location.path('/');
                    }, function error(err) {
                        notifyService.showError('You were unable to change your password. Check if your password is correct.', err);
                    });
            }
        }
    ]);