'use strict';

angular.module('issueSystem.projects.projectsService', [])
    .factory('projectsService', [
        '$http',
        '$q',
        'BASE_URL',
        function ($http, $q, BASE_URL) {
            function getProjectById(projectId) {
                var deferred = $q.defer(),
                    request = {
                        method: 'GET',
                        url: BASE_URL + 'projects/' + projectId
                    };

                $http(request)
                    .then(function (project) {
                        var priorities = project.data.Priorities.map(function(elem){
                            return elem.Name
                        }).join(", ");

                        var labels = project.data.Labels.map(function(elem){
                            return elem.Name
                        }).join(", ");

                        var projectData = {
                            'Id': project.data.Id,
                            'Title': project.data.Name,
                            'ProjectKey': project.data.ProjectKey,
                            'Description': project.data.Description,
                            'LeadId': project.data.Lead.Id,
                            'LeadEmail': project.data.Lead.Username,
                            'Labels': labels ? labels : "-",
                            'Priorities': priorities ? priorities : "-"
                        };
                        deferred.resolve(project.data);
                    }, function (error) {
                        deferred.reject(error.data);
                    });

                return deferred.promise;
            }

            function getIssuesForProject(projectId) {
                var deferred = $q.defer(),
                    request = {
                        method: 'GET',
                        url: BASE_URL + 'projects/' + projectId + '/issues'
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

            return {
                getProjectById: getProjectById,
                getIssuesForProject: getIssuesForProject,
                updateProject: updateProject
            }
        }
    ]
);