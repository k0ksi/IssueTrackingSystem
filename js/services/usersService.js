'use strict';

angular.module('issueSystem.users.usersService', [])
    .factory('usersService', [
        '$http',
        '$q',
        'BASE_URL',
        function ($http, $q, BASE_URL) {
            function getAllUsers() {
                var deferred = $q.defer(),
                    request = {
                        method: 'GET',
                        url: BASE_URL + 'users/'
                    };

                $http(request)
                    .then(function (users) {
                        deferred.resolve(users.data);
                    }, function (err) {
                        deferred.reject(err.data);
                    });

                return deferred.promise;
            }

            return {
                getAllUsers: getAllUsers
            }
        }
    ]);