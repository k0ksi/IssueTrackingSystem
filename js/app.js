'use strict';

var app = angular.module('issueSystem', [
    'ngRoute',
    'ngCookies',
    'ngResource',
    'ngAnimate',
    'angular-loading-bar',
    'ui.bootstrap.pagination',
    'ui.select2',
    'issueSystem.home',
    'issueSystem.users',
    'issueSystem.issues',
    'issueSystem.common',
    'issueSystem.projects',
    'issueSystem.dashboard',
    'issueSystem.users.identity',
    'issueSystem.users.usersService',
    'issueSystem.dashboard.myDashboard',
    'issueSystem.issues.issuesService',
    'issueSystem.projects.projectsService',
    'issueSystem.comments.commentsService',
    'issueSystem.common.datepicker',
    'issueSystem.common.defaultSelect',
    'issueSystem.labels.labelsService'
    ]);

app.constant('BASE_URL_API', 'http://softuni-issue-tracker.azurewebsites.net/api/');
app.constant('BASE_URL', 'http://softuni-issue-tracker.azurewebsites.net/');
app.constant('pageSize', 3);

app.config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when('/home', {
        templateUrl: 'templates/dashboard.html',
        controller: 'DashboardController'
    });

    $routeProvider.when('/projects/add', {
        templateUrl: 'templates/Add-new-project.html',
        controller: 'ProjectsController'
    });

    $routeProvider.when('/projects/:id', {
        templateUrl: 'templates/project-page.html',
        controller: 'ProjectsController'
    });

    $routeProvider.when('/projects/:id/edit', {
        templateUrl: 'templates/Edit-project.html',
        controller: 'ProjectsController'
    });

    $routeProvider.when('/projects/:id/add-issue', {
        templateUrl: 'templates/Add-issue.html',
        controller: 'IssuesController'
    });

    $routeProvider.when('/projects', {
        templateUrl: 'templates/projects.html',
        controller: 'ProjectsController'
    });

    $routeProvider.when('/issues/:id', {
        templateUrl: 'templates/issue-page.html',
        controller: 'IssuesController'
    });

    $routeProvider.when('/issues/:id/edit', {
        templateUrl: 'templates/edit-issue.html',
        controller: 'IssuesController'
    });

    $routeProvider.when('/profile/password', {
        templateUrl: 'templates/change-password.html',
        controller: 'UsersController'
    });

    $routeProvider.when('/', {
        templateUrl: 'templates/home.html',
        controller: 'HomeController'
    });

    $routeProvider.otherwise(
        { redirectTo: '/' }
    );
}]);

app.run(function ($rootScope, $location, authentication) {
    authentication.refreshCookie();
    $rootScope.$on('$locationChangeStart', function () {
        if(($location.path() === "/projects" ||
            $location.path() === "/projects/add") &&
            !authentication.isAdmin()) {
            $location.path('/home');
        }

        if(($location.path().indexOf("/home") != -1 ||
           $location.path().indexOf("/projects") != -1 ||
           $location.path().indexOf("/issues") != -1 ||
           $location.path().indexOf("/profile") != -1) &&
           !authentication.isAuthenticated()) {
            $location.path('/');
        }
    });
});