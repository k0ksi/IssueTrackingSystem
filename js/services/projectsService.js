'use strict';

angular.module('issueSystem.projects.projectsService', [])
    .factory('projectsService', [
        '$http',
        '$rootScope',
        '$q',
        '$resource',
        'authentication',
        'BASE_URL',
        function ($http, $rootScope, $q, $resource, authentication, BASE_URL) {
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

            function getIssuesForProject(projectId, filterData) {
                var filter = filterProjects(filterData);

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
                var labels = parseLabels(projectData.LabelNames),
                    priorities = parsePriorities(projectData.PriorityNames),
                    data;

                if($rootScope.isAdmin) {
                    data = {
                        'Name': projectData.Name,
                        'Description': projectData.Description,
                        'ProjectKey': projectData.ProjectKey,
                        'Labels': labels,
                        'Priorities': priorities,
                        'LeadId': projectData.LeadId
                    };
                } else {
                    data = {
                        'Name': projectData.Name,
                        'Description': projectData.Description,
                        'LeadId': authentication.getUserId(),
                        'Priorities': priorities,
                        'Labels': labels
                    }
                }

                var request = {
                    method: 'PUT',
                    url: BASE_URL + 'projects/' + projectData.Id,
                    data: data
                };

                $http(request).success(success).error(error);
            }

            function createProject(projectData, success, error) {
                var labels = [];
                var labelsArrayLength = projectData.LabelNames.length;
                for (var i = 0; i < labelsArrayLength; i++) {
                    var labelName = projectData.LabelNames[i].trim();
                    var label = {
                        Name: labelName
                    };

                    labels.push(label);
                }

                var priorities = parsePriorities(projectData.PriorityNames);
                var data = {
                    Name: projectData.Name,
                    Description: projectData.Description,
                    ProjectKey: projectData.ProjectKey,
                    LeadId: projectData.LeadId,
                    Labels: labels,
                    Priorities: priorities
                };

                var request = {
                    method: 'POST',
                    url: BASE_URL + 'projects',
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

            function parsePriorities(priorityNames) {
                var prioritiesArray = priorityNames.split(",");
                var priorities = [];
                var prioritiesArrayLength = prioritiesArray.length;
                for (var i = 0; i < prioritiesArrayLength; i++) {
                    var priorityName = prioritiesArray[i].trim();
                    var priority = {
                        Name: priorityName
                    };

                    priorities.push(priority);
                }

                return priorities;
            }

            function parseLabels(labelNames) {
                var labelsArray = labelNames.split(",");
                var labels = [];
                var labelsArrayLength = labelsArray.length;
                for (var i = 0; i < labelsArrayLength; i++) {
                    var labelName = labelsArray[i].trim();
                    var label = {
                        Name: labelName
                    };

                    labels.push(label);
                }

                return labels;
            }

            function filterProjects(filterData) {
                var userId = authentication.getUserId(),
                    data;

                switch (filterData) {
                    case 'My Issues':
                        data = ' and Assignee.Id=="' + userId + '"';
                        break;
                    case 'All Issues':
                        data = '';
                        break;
                    case 'Open Issues':
                        data = ' and Status.Name=="Open"';
                        break;
                    case 'In Progress Issues':
                        data = ' and Status.Name=="InProgress"';
                        break;
                    case 'Stopped Progress Issues':
                        data = ' and Status.Name=="StoppedProgress"';
                        break;
                    case 'Closed Issues':
                        data = ' and Status.Name=="Closed"';
                        break;
                    case 'Due Until Today':
                        var day = new Date().getUTCDay() + 1;
                        var month = new Date().getUTCMonth() + 1;
                        var year = new Date().getUTCFullYear();
                        data = ' and DueDate.Day==' + day +
                            ' and DueDate.Month=' + month +
                            ' and DueDate.Year=' + year;
                        break;
                    default:
                        data = ' and Assignee.Id=="' + userId + '"';
                        break;
                }

                return data;
            }

            return {
                getProjectById: getProjectById,
                getIssuesForProject: getIssuesForProject,
                updateProject: updateProject,
                getProjects: getProjects,
                createProject: createProject,
                getAllProjects: function (params, success, error) {
                    return projectsResource.getAllProjects(params, success, error);
                }
            }
        }
    ]
);