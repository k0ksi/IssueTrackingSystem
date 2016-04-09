'use strict';

angular.module('issueSystem', [
    'ngRoute',
    'issueSystem.home',
    'issueSystem.users.identity'
    ])
    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.otherwise({redirectTo: '/'});
    }])
    .constant('BASE_URL', 'http://softuni-social-network.azurewebsites.net/api/');