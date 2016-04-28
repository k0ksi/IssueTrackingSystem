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
                'orderBy': 'Project.Name desc, IssueKey'
            };

            var affiliatedProjects = [],
                projectIds = {},
                currentUserId = authentication.getUserId();

            $scope.reloadIssues = function () {
                myDashboard.getLatestIssues(
                    $scope.issuesParams,
                    function success(data) {
                        $scope.issues = data.Issues;
                    });

                    /*.then(function (latestIssues) {
                        $scope.latestIssues = latestIssues.Issues;

                        var issuesLength = latestIssues.Issues.length;
                        for (var i = 0; i < issuesLength; i++) {
                            var issue = latestIssues.Issues[i];
                            if(!projectIds[issue.Project.Id]) {
                                affiliatedProjects.push(issue.Project);
                                projectIds[issue.Project.Id] = issue.Project.Id;
                            }
                        }
                    });*/
            };

            $scope.reloadIssues();

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