'use strict';

angular.module('issueSystem.dashboard', [
        'issueSystem.dashboard.myDashboard'
    ])
    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/', {
            templateUrl: 'templates/dashboard.html',
            controller: 'DashboardController'
        })
    }])
    .controller('DashboardController', [
        '$scope',
        'myDashboard',
        'authentication',
        function ($scope, myDashboard, authentication) {
            $scope.issuesParams = {
                'pageNumber' : 1,
                'pageSize' : 3,
                'orderBy': 'DueDate desc'
            };

            var affiliatedProjects = [],
                projectIds = {},
                currentUserId = authentication.getUserId();

            $scope.reloadIssues = function () {
                myDashboard.getLatestIssues(
                    $scope.issuesParams,
                    function success(data) {
                        $scope.issues = data;
                        var issuesLength = data.Issues.length;
                        for (var i = 0; i < issuesLength; i++) {
                            var issue = data.Issues[i];
                            if(!projectIds[issue.Project.Id]) {
                                affiliatedProjects.push(issue.Project);
                                projectIds[issue.Project.Id] = issue.Project.Id;
                            }
                        }
                    });
            };

            $scope.reloadIssues();

            myDashboard.getAllIssues()
                .then(function (allIssues) {
                    var issuesLength = allIssues.Issues.length;
                    for (var i = 0; i < issuesLength; i++) {
                        var issue = allIssues.Issues[i];
                        if(!projectIds[issue.Project.Id]) {
                            affiliatedProjects.push(issue.Project);
                            projectIds[issue.Project.Id] = issue.Project.Id;
                        }
                    }
                });

            myDashboard.getProjectsWithCurrentUserAsLead(currentUserId)
                .then(function (myProjects) {
                    $scope.myProjects = myProjects.Projects;

                    var projectsLength = myProjects.Projects.length;
                    for (var i = 0; i < projectsLength; i++) {
                        var project = myProjects.Projects[i];
                        if(!projectIds[project.Id]) {
                            affiliatedProjects.push(project);
                            projectIds[project.Id] = project.Id;
                        }
                    }

                    $scope.userAffiliatedProjects = affiliatedProjects;
                });
    }]);