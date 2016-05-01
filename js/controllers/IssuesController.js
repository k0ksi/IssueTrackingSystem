'use strict';

angular.module('issueSystem.issues', [
        'issueSystem.issues.issuesService'
    ])
    .controller('IssuesController', [
        '$scope',
        '$route',
        '$routeParams',
        '$location',
        'issuesService',
        'authentication',
        'usersService',
        'projectsService',
        'notifyService',
        function ($scope, $route, $routeParams, $location, issuesService, authentication, usersService, projectsService, notifyService) {
            var projectId,
                issueId,
                userEmail = authentication.getUserEmail(),
                userId = authentication.getUserId();

            if($location.path().indexOf('/projects') != -1) {
                projectId = $routeParams.id;
            } else {
                issueId = $routeParams.id;
            }

            $scope.issueData = {
                ProjectId: projectId
            };

            $scope.isAdmin = authentication.isAdmin();

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

            if(projectId){
                projectsService.getProjectById(projectId)
                    .then(function (projectData) {
                        $scope.projectData = projectData;
                        $scope.isCurrentUserProjectLead = projectData.Lead.Id === authentication.getUserId();
                    }, function (err) {
                        notifyService.showError('Cannot load project', err);
                    });
            }

            if(issueId) {
                $scope.currentUserId = userId;

                issuesService.getIssueById(issueId)
                    .then(function (issueData) {
                        $scope.issueData = issueData;
                    }, function (err) {
                        notifyService.showError('Cannot load issue', err);
                    });

                issuesService.getCommentsForIssue(issueId)
                    .then(function (issueComments) {
                        $scope.comments = issueComments.data;
                        $scope.commentsNone = issueComments.data.length === 0;
                    }, function (err) {
                        notifyService.showError('Cannot load comments for the current issue', err);
                    })

                $scope.changeIssuesStatus = function(issueId, statusId) {
                    issuesService.changeStatus(issueId, statusId)
                        .then(function () {
                            notifyService.showInfo('Issue\'s current status has been changed successfully');
                            $route.reload();
                        }, function (error) {
                            notifyService.showError('Issue\'s current status was not changed', error);
                        });
                }
            }

            $scope.addIssue = function (issueData) {
                issuesService.createIssue(issueData,
                    function success() {
                        notifyService.showInfo("You have successfully posted a new issue");
                        $location.path('/projects/' + projectId);
                    }, function error(err) {
                        notifyService.showError("Couldn't create a new issue", err);
                    });
            };

            $scope.joinProperties = function (array) {
                if(array !== undefined) {
                    var result = array.map(function (element) {
                        return element.Name
                    }).join(", ");

                    return result;
                }
            };

            if(projectId) {
                getAllProjects();
            }
        }
    ]);