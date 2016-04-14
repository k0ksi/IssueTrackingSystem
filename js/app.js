'use strict';

var app = angular.module('issueSystem', [
    'ngRoute',
    'ui.router',
    'issueSystem.home',
    'issueSystem.users.identity'
    ]);

app.constant('BASE_URL', 'http://softuni-issue-tracker.azurewebsites.net/api/');

app.config(function ($stateProvider) {
    $stateProvider.state('root', {
        templateUrl: 'templates/home.html',
        controller: 'HomeController'
    });
});

/*
app.config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when('/', {
        templateUrl: 'templates/home.html',
        controller: 'HomeController'
    });

    $routeProvider.otherwise({redirectTo: '/'});
}]);*/
