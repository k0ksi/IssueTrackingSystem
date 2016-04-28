'use strict';

var app = angular.module('issueSystem', [
    'ngRoute',
    'ngCookies',
    'ngResource',
    'ui.bootstrap.pagination',
    'issueSystem.common',
    'issueSystem.users.identity',
    'issueSystem.home',
    'issueSystem.dashboard',
    'issueSystem.dashboard.myDashboard'
    ]);

app.constant('BASE_URL_API', 'http://softuni-issue-tracker.azurewebsites.net/api/');
app.constant('BASE_URL', 'http://softuni-issue-tracker.azurewebsites.net/');
app.constant('pageSize', 3);

app.config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when('/', {
        templateUrl: 'templates/home.html',
        controller: 'HomeController'
    });

    $routeProvider.when('/home', {
        templateUrl: 'templates/dashboard.html',
        controller: 'DashboardController'
    });

    $routeProvider.when('/project/:id', {
        templateUrl: 'templates/project-page.html',
        controller: 'ProjectsController'
    });

    $routeProvider.otherwise({redirectTo: '/'});
}]);

app.run(function ($rootScope, $location, authentication) {
    authentication.refreshCookie();

    $rootScope.$on('$locationChangeStart', function () {
        if($location.path().indexOf("/home") != -1 && !authentication.isAuthenticated()) {
            $location.path('/');
        }

        if($location.path().indexOf("/") != -1 && authentication.isAuthenticated()) {
            $location.path('/home');
        }
    });
});