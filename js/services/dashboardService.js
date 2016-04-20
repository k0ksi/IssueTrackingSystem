angular.module('issueSystem.dashboard.myDashboard', [])
    .factory('myDashboard', [
        '$http',
        '$q',
        'BASE_URL_API',
        function ($http, $q, BASE_URL_API) {
            function getLatestIssues() {

                var deferred = $q.defer();

                $http.get(BASE_URL_API + 'issues/me?orderBy=Project.Name desc, IssueKey&pageSize=2&pageNumber=1')
                    .then(function (issues) {
                        deferred.resolve(issues)
                    });

                return deferred.promise;
            }

            return {
                getLatestIssues: getLatestIssues
            }
        }]);