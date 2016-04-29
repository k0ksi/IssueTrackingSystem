'use strict';

angular.module('issueSystem.issues', [
        'issueSystem.issues.issuesService'
    ])
    .controller('IssuesController', [
        '$scope',
        'issuesService',
        'authentication',
        'usersService',
        function ($scope, issuesService, authentication, usersService) {
            var projectId = $routeParams.id;
            $scope.issueData = {
                ProjectId: projectId,
            };

            usersService.getAllUsers()
                .then(function (users) {
                    $scope.users = users
                });
        }
    ])