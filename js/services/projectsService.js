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
                getProjects: getProjects
            }
        }
    ]
);