'use strict';

angular.module('issueSystem.issues', [
        'issueSystem.issues.issuesService'
    ])
    .controller('IssuesController', [
        '$scope',
        '$routeParams',
        'issuesService',
        'authentication',
        'usersService',
        'projectsService',
        function ($scope, $routeParams, issuesService, authentication, usersService, projectsService) {
            var projectId = $routeParams.id,
                userEmail = authentication.getUserEmail(),
                userId = authentication.getUserId();

            $scope.issueData = {
                ProjectId: projectId,
            };

            usersService.getAllUsers()
                .then(function (users) {
                    $scope.users = users
                });

            function getAllProjects() {
                projectsService.getProjects()
                    .then(function (projectData) {
                        $scope.projects = projectData.data;
                    }, function (err) {
                        notifyService.showError('Cannot load all projects', err);
                    });
            }

            projectsService.getProjectById(projectId)
                .then(function (projectData) {
                    $scope.projectData = projectData;
                }, function (err) {
                    notifyService.showError('Cannot load project', err);
                });

            $scope.addIssue = function (issueData) {
                issuesService.createIssue(issueData,
                    function success() {
                        notifyService.showInfo("You have successfully posted a new issue");
                        $location.path('/projects/' + projectId);
                    }, function error(err) {
                        notifyService.showError("Couldn't create a new issue", err);
                    });
            };

            getAllProjects();
        }
    ]);