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
                    console.log(latestIssues);
                    $scope.latestIssue = latestIssues;
                });
    }]);