'use strict';

angular.module('issueSystem.dashboard.myDashboard', [])
    .factory('myDashboard', [
        '$http',
        '$q',
        'BASE_URL',
        'authentication',
        function ($http, $q, BASE_URL, authentication) {
            function getLatestIssues() {
                var headers = authentication.getAuthHeaders(),
                    pageSize = 3,
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

            function getProjectsWithCurrentUserAsLead() {
                var headers = authentication.getAuthHeaders(),
                    leadId = authentication.getUserInfo().Id,
                    deferred = $q.defer(),
                    request = {
                        method: 'GET',
                        url: BASE_URL + 'projects?filter=Lead.Id="92925a62-07ab-435a-819e-33dd6ac907ef"&pageSize=50&pageNumber=1',
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
                getLatestIssues: getLatestIssues,
                getProjectsWithCurrentUserAsLead: getProjectsWithCurrentUserAsLead
            }
        }]);