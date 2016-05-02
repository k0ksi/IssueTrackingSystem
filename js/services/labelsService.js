'use strict';

angular.module('issueSystem.labels.labelsService', [])
    .factory('labelsService', [
        '$http',
        '$q',
        'BASE_URL',
        function ($http, $q, BASE_URL) {
            function getAllLabels() {
                var deferred = $q.defer(),
                    request = {
                        method: 'GET',
                        url: BASE_URL + 'labels/?filter'
                    };

                $http(request)
                    .then(function (labels) {
                        deferred.resolve(labels);
                    }, function (err) {
                        deferred.reject(err);
                    });

                return deferred.promise;
            }

            return {
                getAllLabels: getAllLabels
            }
        }
    ]);