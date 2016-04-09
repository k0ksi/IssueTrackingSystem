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
        function ($scope, $location, authentication) {
            $scope.login = function (user) {
                authentication.loginUser(user)
                    .then(function (loggedInUser) {
                        console.log(loggedInUser);
                    });
            };

            $scope.register = function (user) {
                authentication.registerUser(user)
                    .then(function (registeredUser) {
                        console.log(registeredUser);
                    });
            };
        }]);