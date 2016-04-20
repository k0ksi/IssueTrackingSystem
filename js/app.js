'use strict';

var app = angular.module('issueSystem', [
    'ngRoute',
    'ui.router',
    'issueSystem.home',
    'issueSystem.users.identity',
    'issueSystem.dashboard'
    ]);

app.constant('BASE_URL_API', 'http://softuni-issue-tracker.azurewebsites.net/api/');
app.constant('BASE_URL', 'http://softuni-issue-tracker.azurewebsites.net/');

// TODO Delete logic below
/*app.config(function ($stateProvider) {
    $stateProvider.state('root', {
        url: '',
        controller: function ($state) {
            if($state.is('root')) {
                $state.go(sessionStorage['currentUser'] ? "dashboard" : "anonymous");
            }
        }
    });

    $stateProvider.state('anonymous', {
        templateUrl: 'templates/home.html',
        controller: 'HomeController'
    });

    $stateProvider.state('dashboard', {
        templateUrl: 'templates/dashboard.html',
        controller: 'DashboardController'
    });
});*/

app.config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when('/', {
        templateUrl: 'templates/home.html',
        controller: 'HomeController'
    });

    $routeProvider.otherwise({redirectTo: '/'});
}]);

app.config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when('/dashboard', {
        templateUrl: 'templates/dashboard.html',
        controller: 'DashboardController'
    });

    $routeProvider.otherwise({redirectTo: '/'});
}]);