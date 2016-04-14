'use strict';

var app = angular.module('issueSystem', [
    'ngRoute',
    'issueSystem.home',
    'issueSystem.users.identity'
    ]);

app.constant('BASE_URL', 'http://softuni-issue-tracker.azurewebsites.net/api/');

app.config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when('/', {
        templateUrl: 'templates/home.html',
        controller: 'HomeController'
    });

    $routeProvider.otherwise({redirectTo: '/'});
}]);