'use strict';

angular.module('issueSystem.projects', [
        'issueSystem.projects.projectsService',
        'issueSystem.users.usersService'
    ])
    .controller('ProjectsController', [
        '$scope',
        'projectsService',
        '$routeParams',
        '$location',
        'authentication',
        'notifyService',
        'usersService',
        function ($scope, projectsService, $routeParams, $location, authentication, notifyService, usersService) {
            $scope.projectData = {};

            function getProjectById(id) {
                projectsService.getProjectById(id)
                    .then(function (projectData) {
                        getIssuesForProject($routeParams.id);
                        usersService.getAllUsers()
                            .then(function (users) {
                                $scope.users = users
                            });
                        $scope.isCurrentUserProjectLead = projectData.Lead.Id === authentication.getUserId();
                        $scope.projectData = projectData;
                    }, function (err) {
                        notifyService.showError('Cannot load project', err);
                    });
            }

            function getIssuesForProject(projectId) {
                projectsService.getIssuesForProject(projectId)
                    .then(function (issues) {
                        $scope.projectData.issues = issues.data;
                        $scope.issuesNone = issues.data.length === 0;
                    }, function (err) {
                        notifyService.showError('Cannot load issues for this particular project', err);
                    });
            }

            $scope.editProject = function (projectData) {
                projectsService.updateProject(projectData,
                    function success() {
                        notifyService.showInfo('You have successfully edited the project');
                        $location.path('/projects/' + projectData.Id);
                    }, function error(err) {
                        notifyService.showError('Editing the project failed', err);
                    })
            };

            $scope.joinProperties = function (array) {
                if(array !== undefined) {
                    var result = array.map(function (element) {
                        return element.Name
                    }).join(", ");

                    return result;
                }
            };

            function getAllUsers() {

            }

            getProjectById($routeParams.id);
        }
    ]
);