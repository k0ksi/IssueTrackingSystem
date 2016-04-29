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

            $scope.addIssue = function (issueData) {
                issuesService.createIssue(issueData,
                    function success() {
                        notifyService.showInfo("You have successfully posted a new issue");
                        $location.path('/projects/' + projectId);
                    }, function error(err) {
                        notifyService.showError("Couldn't create a new issue", err);
                    });
            }
        }
    ]);