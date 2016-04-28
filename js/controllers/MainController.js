'use strict';

angular.module('issueSystem.common', [])
    .controller('MainController', [
        '$scope',
        '$location',
        'identity',
        'authentication',
        'notifyService',
        function($scope, $location, identity, authentication, notifyService) {
            identity.getCurrentUser()
                .then(function(user) {
                    $scope.currentUser = user;
                    $scope.isAuthenticated = true;
                });

            $scope.logout = function () {
                authentication.logout();
                notifyService.showInfo('You have successfully logged out!');
                $location.path('/')
            };
        }]);