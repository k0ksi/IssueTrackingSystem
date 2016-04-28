'use strict';

angular.module('issueSystem.projects.service', [])
    .factory('', [
        '',
        function () {
            function getProjectById(projectId) {
                var deferred = $q.defer();

                $http.get(BASE_URL + 'projects/' + projectId)
                    .then(function (project) {
                        deferred.resolve(project);
                    }, function (err) {
                        deferred.reject(err);
                    });

                return deferred.promise;
            }

            return {
                getProjectById: getProjectById
            }
        }
    ]
);