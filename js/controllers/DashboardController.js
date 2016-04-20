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
            myDashboard.getLatestIssues()
                .then(function (latestIssues) {
                    var issues = latestIssues.Issues;
                    $scope.latestIssues = issues;

                    var projectIds = [];

                    for (var i = 0; i < issues.length; i++) {
                        var issue = issues[i];
                        projectIds.push(issue.Project.Id);
                    }

                    console.log(projectIds);
                });
    }]);