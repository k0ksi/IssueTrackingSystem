angular.module('issueSystem.dashboard.myDashboard', [])
    .factory('myDashboard', [
        '$http',
        '$q',
        'BASE_URL',
        'authentication',
        function ($http, $q, BASE_URL, authentication) {
            function getLatestIssues() {
                var headers = authentication.getAuthHeaders();

                var request = {
                    method: 'GET',
                    url: BASE_URL + 'issues/me?orderBy=Project.Name desc, IssueKey&pageSize=2&pageNumber=1',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                        'Authorization': headers
                    }
                };

                var deferred = $q.defer();

                $http(request)
                    .then(function (issues) {
                        deferred.resolve(issues.data);
                    }, function (error) {
                        deferred.reject(error.data);
                    });

                return deferred.promise;
            }

            return {
                getLatestIssues: getLatestIssues
            }
        }]);