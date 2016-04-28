'use strict';

angular.module('issueSystem.home', [
        'issueSystem.users.authentication'
    ])
    .config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/', {
            templateUrl: 'templates/home.html',
            controller: 'HomeController'
        })
    }])
    .controller('HomeController', [
        '$scope',
        '$location',
        'authentication',
        'notifyService',
        function ($scope, $location, authentication, notifyService) {
            if(authentication.isAuthenticated()) {
                $location.path('/home');
            }

            $scope.login = function (user) {
                authentication.loginUser(user)
                    .then(function () {
                        notifyService.showInfo('You have successfully logged in!');
                        $scope.isAuthenticated = true;
                        $location.path('/dashboard');
                    }, function (err) {
                        notifyService.showError('You were unable to login. Check your credentials!', err.error);
                    });
            };

            $scope.register = function (user) {
                authentication.registerUser(user)
                    .then(function () {
                        notifyService.showInfo('You have successfully registered!');
                        $scope.isAuthenticated = true;
                        $location.path('/dashboard');
                    }, function (err) {
                        notifyService.showError('You were unable to register! Check the length of your password.', err.error);
                    });
            };            
        }]);