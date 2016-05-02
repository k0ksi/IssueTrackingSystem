'use strict';

angular.module('issueSystem.issues.issuesService', [])
    .factory('issuesService', [
        '$http',
        '$q',
        'BASE_URL',
        function ($http, $q, BASE_URL) {
            function createIssue(issueData, success, error) {
                var data = getIssueData(issueData);

                var request = {
                    method: 'POST',
                    url: BASE_URL + 'issues/',
                    data: data
                };

                $http(request).success(success).error(error);
            }

            function getIssueById(issueId) {
                var deferred = $q.defer(),
                    request = {
                        method: 'GET',
                        url: BASE_URL + 'issues/' + issueId
                    };

                $http(request)
                    .then(function (issue) {
                        deferred.resolve(issue.data);
                    }, function (error) {
                        deferred.reject(error.data);
                    });

                return deferred.promise;
            }

            function getCommentsForIssue(issueId) {
                var deferred = $q.defer(),
                    request = {
                        method: 'GET',
                        url: BASE_URL + 'issues/' + issueId + '/comments'
                    };

                $http(request)
                    .then(function (comments) {
                        deferred.resolve(comments);
                    }, function (error) {
                        deferred.reject(error);
                    });

                return deferred.promise;
            }

            function updateIssue(issueData, success, error) {
                var data = getIssueData(issueData);

                var request = {
                    method: 'PUT',
                    url: BASE_URL + 'issues/' + issueData.Id,
                    data: data
                };

                $http(request).success(success).error(error);
            }

            function changeStatus(issueId, statusId) {
                var deferred = $q.defer(),
                    request = {
                        method: 'PUT',
                        url: BASE_URL + 'issues/' + issueId + '/changestatus?statusid=' + statusId
                    };

                $http(request)
                    .then(function (success) {
                        deferred.resolve(success);
                    }, function (error) {
                        deferred.reject(error);
                    });

                return deferred.promise;
            }

            function getIssueData(issueData) {
                var labelsArray = issueData.LabelNames.split(",");
                var labels = [];
                var labelsArrayLength = labelsArray.length;
                for (var i = 0; i < labelsArrayLength; i++) {
                    var labelName = labelsArray[i].trim();
                    var label = {
                        Name: labelName
                    };

                    labels.push(label);
                }

                var data = {
                    Title: issueData.Title,
                    Description: issueData.Description,
                    DueDate: issueData.DueDate,
                    ProjectId: issueData.ProjectId,
                    AssigneeId: issueData.AssigneeId,
                    PriorityId: issueData.PriorityId,
                    Labels: labels
                };

                return data;
            }

            return {
                createIssue: createIssue,
                getIssueById: getIssueById,
                getCommentsForIssue: getCommentsForIssue,
                changeStatus: changeStatus,
                updateIssue: updateIssue
            }
        }
    ]);