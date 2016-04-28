'use strict';

angular.module('issueSystem.dashboard.myDashboard', [])
    .factory('myDashboard', [
        '$http',
        '$q',
        '$resource',
        'BASE_URL',
        'identity',
        'authentication',
        function ($http, $q, $resource, BASE_URL, identity, authentication) {
            var headers = authentication.getAuthHeaders();

            var issuesResource = $resource(
                BASE_URL + 'issues/me',
                null,
                {
                    'getLatestIssues': {
                        method: 'GET',
                        headers: {
                            'Authorization': headers
                        }
                    }
                }
            );

            function getLatestIssues(issuesParams) {
                var headers = authentication.getAuthHeaders(),
                    pageSize = issuesParams.pageSize,
                    pageNumber = 1,
                    deferred = $q.defer(),
                    request = {
                        method: 'GET',
                        url: BASE_URL + 'issues/me?orderBy=DueDate desc, IssueKey&pageSize=' + pageSize + '&pageNumber=' + pageNumber,
                        headers: {
                            'Authorization': headers
                        }
                    };

                $http(request)
                    .then(function (issues) {
                        deferred.resolve(issues.data);
                    }, function (error) {
                        deferred.reject(error.data);
                    });

                return deferred.promise;
            }

            function getProjectsWithCurrentUserAsLead(leadId) {
                var headers = authentication.getAuthHeaders(),
                    deferred = $q.defer(),
                    request = {
                        method: 'GET',
                        url: BASE_URL + 'projects?filter=Lead.Id="' + leadId + '"&pageSize=50&pageNumber=1',
                        headers: {
                            'Authorization': headers
                        }
                    };

                $http(request)
                    .then(function (issues) {
                        deferred.resolve(issues.data);
                    }, function (error) {
                        deferred.reject(error.data);
                    });

                return deferred.promise;
            }

            return {
                getLatestIssues: function (params, success, error) {
                    return issuesResource.getLatestIssues(params, success, error);
                },
                getProjectsWithCurrentUserAsLead: getProjectsWithCurrentUserAsLead
            }
        }]);