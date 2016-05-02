'use strict';

angular.module('issueSystem.projects.projectsService', [])
    .factory('projectsService', [
        '$http',
        '$q',
        '$resource',
        'authentication',
        'BASE_URL',
        function ($http, $q, $resource, authentication, BASE_URL) {
            function getProjectById(projectId) {
                var deferred = $q.defer(),
                    request = {
                        method: 'GET',
                        url: BASE_URL + 'projects/' + projectId
                    };

                $http(request)
                    .then(function (project) {
                        deferred.resolve(project.data);
                    }, function (error) {
                        deferred.reject(error.data);
                    });

                return deferred.promise;
            }

            // http://softuni-issue-tracker.azurewebsites.net/issues/?filter=Project.Id ==245 and Assignee.Id="92925a62-07ab-435a-819e-33dd6ac907ef"&pageSize=10000&pageNumber=1
            function getIssuesForProject(projectId, filterData) {
                var userId = authentication.getUserId(),
                    filter;

                switch (filterData) {
                    case 'My Issues':
                        filter = ' and Assignee.Id=="' + userId + '"';
                        break;
                    case 'All Issues':
                        filter = '';
                        break;
                    case 'Open Issues':
                        filter = ' and Status.Name=="Open"';
                        break;
                    case 'In Progress Issues':
                        filter = ' and Status.Name=="InProgress"';
                        break;
                    case 'Stopped Progress Issues':
                        filter = ' and Status.Name=="StoppedProgress"';
                        break;
                    case 'Closed Issues':
                        filter = ' and Status.Name=="Closed"';
                        break;
                    case 'Due Until Today':
                        var day = new Date().getUTCDay() + 1;
                        var month = new Date().getUTCMonth() + 1;
                        var year = new Date().getUTCFullYear();
                        filter = ' and DueDate.Day==' + day +
                                 ' and DueDate.Month=' + month +
                                 ' and DueDate.Year=' + year;
                        break;
                    default:
                        filter = ' and Assignee.Id=="' + userId + '"';
                        break;
                }

                var url = BASE_URL +
                        'issues/' +
                        '?filter=Project.Id==' + projectId +
                        filter +
                        '&pageSize=10000&pageNumber=1';

                var deferred = $q.defer(),
                    request = {
                        method: 'GET',
                        url: url
                    };

                $http(request)
                    .then(function (issues) {
                        deferred.resolve(issues);
                    }, function (error) {
                        deferred.reject(error);
                    });

                return deferred.promise;
            }

            function updateProject(projectData, success, error) {
                var data = {
                    'Name': projectData.Name,
                    'Description': projectData.Description,
                    'Labels': projectData.Labels,
                    'Priorities': projectData.Priorities,
                    'LeadId': projectData.Lead.Id
                };

                var request = {
                    method: 'PUT',
                    url: BASE_URL + 'projects/' + projectData.Id,
                    data: data
                };

                $http(request).success(success).error(error);
            }

            var projectsResource = $resource(
                BASE_URL + 'projects',
                null,
                {
                    'getAllProjects': {
                        method: 'GET'
                    }
                }
            );

            function getProjects() {
                var deferred = $q.defer(),
                    request = {
                        method: 'GET',
                        url: BASE_URL + 'projects/'
                    };

                $http(request)
                    .then(function (projects) {
                        deferred.resolve(projects);
                    }, function (error) {
                        deferred.reject(error);
                    });

                return deferred.promise;
            }

            return {
                getProjectById: getProjectById,
                getIssuesForProject: getIssuesForProject,
                updateProject: updateProject,
                getProjects: getProjects,
                getAllProjects: function (params, success, error) {
                    return projectsResource.getAllProjects(params, success, error);
                }
            }
        }
    ]
);