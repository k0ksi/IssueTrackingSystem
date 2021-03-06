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
        'commentsService',
        'labelsService',
        function ($scope, $route, $routeParams, $location, issuesService, authentication, usersService, projectsService, notifyService, commentsService, labelsService) {
            var projectId,
                issueId,
                userEmail = authentication.getUserEmail(),
                userId = authentication.getUserId();
            $scope.comment = {
                Text: ''
            };

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
                getProjectDetailsById(projectId);
                if($location.path() === '/projects/' + projectId + '/add-issue') {
                    getAllLabels();
                }
            }

            if(issueId) {
                $scope.currentUserId = authentication.getUserId();

                issuesService.getIssueById(issueId)
                    .then(function (issueData) {
                        getProjectDetailsById(issueData.Project.Id);
                        $scope.issueData = issueData;
                        $scope.issueData.LabelNames = joinProperties(issueData.Labels);
                        $scope.isCurrentUserIssueAuthorOrAssignee = issueData.Author.Id === authentication.getUserId();
                    }, function (err) {
                        notifyService.showError('Cannot load issue', err);
                    });

                issuesService.getCommentsForIssue(issueId)
                    .then(function (issueComments) {
                        $scope.comments = issueComments.data;
                        $scope.commentsNone = issueComments.data.length === 0;
                    }, function (err) {
                        notifyService.showError('Cannot load comments for the current issue', err);
                    });

                $scope.changeIssuesStatus = function(issueId, statusId, statusName, oldStatus) {
                    var status = {
                        Id: oldStatus.Id,
                        Name: oldStatus.Name
                    };

                    issuesService.changeStatus(issueId, statusId)
                        .then(function () {
                            notifyService.showInfo('Issue\'s current status has been changed successfully');
                            $scope.issueData.Status.Name = statusName;
                            $scope.issueData.Status.Id = statusId;

                            if(statusName === 'Closed') {
                                $scope.issueData.AvailableStatuses = [];
                            } else {
                                if(status.Name == 'Open') {
                                    var stoppedProgressStatus = {
                                        Id: 4,
                                        Name: 'StoppedProgress'
                                    };

                                    $scope.issueData.AvailableStatuses.push(stoppedProgressStatus);
                                } else {
                                    $scope.issueData.AvailableStatuses.push(status);
                                }

                                var length = $scope.issueData.AvailableStatuses.length;
                                for (var i = 0; i < length; i++) {
                                    var statusObj = $scope.issueData.AvailableStatuses[i];

                                    if(statusObj.Name == statusName) {
                                        $scope.issueData.AvailableStatuses.splice(i, 1);
                                        break;
                                    }
                                }
                            }
                        }, function (error) {
                            notifyService.showError('Issue\'s current status was not changed', error);
                        });
                };

                $scope.editIssue = function (issueData) {
                    issuesService.updateIssue(issueData,
                        function success() {
                            notifyService.showInfo('You have successfully edited the issue');
                            $location.path('/issues/' + issueData.Id);
                        }, function error(err) {
                            notifyService.showError('Editing the issue failed', err);
                        })
                };

                $scope.addComment = function (issueId, comment) {
                    commentsService.addComment(issueId,
                        comment,
                        function success() {
                            notifyService.showInfo('You have successfully added a new comment');
                        }, function error(err) {
                            notifyService.showError('Adding your comment failed. Please enter text for your comment.', err);
                        })
                };

                $scope.appendComment = function (commentText) {
                    var text = commentText.Text;
                    var comment = {
                        Text: text,
                        Author: {
                            Username: authentication.getUserEmail()
                        },
                        CreatedOn: new Date()
                    };

                    $scope.comment = { };
                    $scope.comments.push(comment);
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

            function joinProperties(array) {
                if(array !== undefined) {
                    var result = array.map(function (element) {
                        return element.Name
                    }).join(", ");

                    return result;
                }
            }

            function getProjectDetailsById(projectId) {
                projectsService.getProjectById(projectId)
                    .then(function (projectData) {
                        $scope.projectData = projectData;
                        $scope.priorities = projectData.Priorities;
                        $scope.isCurrentUserProjectLead = projectData.Lead.Id === authentication.getUserId();
                    }, function (err) {
                        notifyService.showError('Cannot load project', err);
                    });
            }

            function getAllLabels() {
                labelsService.getAllLabels()
                    .then(function (labels) {
                        $scope.labels = labels.data;
                    });
            }

            if(projectId) {
                getAllProjects();
            }
        }
    ]);