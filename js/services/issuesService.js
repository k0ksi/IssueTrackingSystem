'use strict';

angular.module('issueSystem.issues.issuesService', [])
    .factory('issuesService', [
        '$http',
        'BASE_URL',
        function ($http, BASE_URL) {
            function createIssue(issueData, success, error) {
                var request = {
                    method: 'POST',
                    url: BASE_URL + 'issues/',
                    data: issueData
                };

                $http(request).success(success).error(error);
            }

            return {
                createIssue: createIssue
            }
        }
    ]);