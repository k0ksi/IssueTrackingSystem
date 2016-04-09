angular.module('issueSystem.dashboard', [])
    .factory('dashboard', [
        '$http',
        '$q',
        'BASE_URL',
        function ($http, $q, BASE_URL) {
            function getLatestIssues() {

                var deferred = $q.defer();

                $http.get(BASE_URL + 'issues/me')
                    .then(function (issues) {
                        deferred.resolve(issues)
                    })

                return deferred.promise;
            }

            return {
                getLatestIssues: getLatestIssues
            }
        }]);