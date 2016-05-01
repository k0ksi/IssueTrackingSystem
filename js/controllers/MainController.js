'use strict';

angular.module('issueSystem.common', [])
    .controller('MainController', [
        '$scope',
        '$rootScope',
        '$route',
        '$location',
        'identity',
        'authentication',
        'notifyService',
        function($scope, $rootScope, $route, $location, identity, authentication, notifyService) {
            identity.getCurrentUser()
                .then(function(user) {
                    $scope.currentUser = user;
                    $rootScope.isAuthenticated = authentication.isAuthenticated();
                });

            $scope.logout = function () {
                $scope = $scope.$new(true);
                authentication.logout();
                $rootScope.isAuthenticated = authentication.isAuthenticated();
                notifyService.showInfo('You have successfully logged out!');
                $location.path('/');
            };
        }]);