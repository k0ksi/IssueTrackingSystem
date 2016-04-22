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
        function ($scope, myDashboard) {
            var affiliatedProjects = [];

            myDashboard.getLatestIssues()
                .then(function (latestIssues) {
                    $scope.latestIssues = latestIssues.Issues;

                    var issuesLength = latestIssues.Issues.length;
                    for (var i = 0; i < issuesLength; i++) {
                        var issue = latestIssues.Issues[i];
                        affiliatedProjects.push(issue.Project);
                    }
                });

            myDashboard.getProjectsWithCurrentUserAsLead()
                .then(function (myProjects) {
                    $scope.myProjects = myProjects.Projects;

                    var projectsLength = myProjects.Projects.length;
                    for (var i = 0; i < projectsLength; i++) {
                        var project = myProjects.Projects[i];
                        affiliatedProjects.push(project);
                    }

                    $scope.userAffiliatedProjects = affiliatedProjects;
                });
    }]);