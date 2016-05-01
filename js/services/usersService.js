'use strict';

angular.module('issueSystem.users.usersService', [])
    .factory('usersService', [
        '$http',
        '$q',
        'BASE_URL',
        'BASE_URL_API',
        function ($http, $q, BASE_URL, BASE_URL_API) {
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

            function updatePassword(passData, success, error) {
                var request = {
                    method: 'POST',
                    url: BASE_URL_API + 'Account/ChangePassword',
                    data: passData
                };

                $http(request).success(success).error(error);
            }

            return {
                getAllUsers: getAllUsers,
                updatePassword: updatePassword
            }
        }
    ]);