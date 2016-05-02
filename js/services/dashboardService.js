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
            var issuesResource = $resource(
                BASE_URL + 'issues/me',
                null,
                {
                    'getLatestIssues': {
                        method: 'GET'
                    }
                }
            );

            var latestIssues = $resource(
                BASE_URL + 'issues/me?orderBy=Project.Name desc, IssueKey&pageSize=100&pageNumber=1',
                null,
                {
                    'getLatestIssues': {
                        method: 'GET'
                    }
                }
            );

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
                getProjectsWithCurrentUserAsLead: getProjectsWithCurrentUserAsLead,
                getAllIssues: function (success, error) {
                    return latestIssues.getLatestIssues(success, error);
                }
            }
        }]);