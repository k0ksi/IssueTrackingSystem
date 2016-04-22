angular.module('issueSystem.users.identity', [])
    .factory('identity', [
        '$http',
        '$q',
        'BASE_URL_API',
        'BASE_URL',
        function ($http, $q, BASE_URL_API, BASE_URL) {
            var deferred = $q.defer(),
                currentUser = undefined,
                accessToken = '',
                request = {
                    method: 'GET',
                    url: BASE_URL + 'users/me',
                    headers: {
                        'Authorization': 'Bearer ' + sessionStorage['accessToken']
                    }
                };

            $http.defaults.headers.common.Authorization =
                'Bearer ' + accessToken;

            $http(request)
                .then(function (response) {
                    currentUser = response.data;
                    deferred.resolve(currentUser);
                });

            return {
                getCurrentUser: function () {
                    if(currentUser) {
                        return $q.when(currentUser);
                    } else {
                        return deferred.promise;
                    }
                },
                isAuthenticated: function () {
                    return true;
                }
            };
        }]);