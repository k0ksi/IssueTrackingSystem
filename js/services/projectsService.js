'use strict';

angular.module('issueSystem.projects.projectsService', [])
    .factory('projectsService', [
        '$http',
        '$q',
        'BASE_URL',
        'authentication',
        function ($http, $q, BASE_URL, authentication) {


            function getProjectById(projectId) {
                var deferred = $q.defer(),
                    headers = authentication.getAuthHeaders(),
                    request = {
                        method: 'GET',
                        url: BASE_URL + 'projects/' + projectId,
                        headers: {
                            'Authorization': headers
                        }
                    };

                $http(request)
                    .then(function (project) {
                        deferred.resolve(project.data);
                    }, function (error) {
                        deferred.reject(error.data);
                    });

                return deferred.promise;
            }

            return {
                getProjectById: getProjectById
            }
        }
    ]
);