angular.module('issueSystem.users.identity', [])
    .factory('identity', [
        '$http',
        '$q',
        '$cookies',
        'BASE_URL_API',
        'BASE_URL',
        function ($http, $q, $cookies, BASE_URL_API, BASE_URL) {
            var deferred = $q.defer(),
                currentUser = undefined,
                ID_KEY = '!__Id_Cookie_Key_!';

            return {
                getCurrentUser: function () {
                    if(currentUser) {
                        return $q.when(currentUser);
                    } else {
                        return deferred.promise;
                    }
                },
                removeUserProfile: function () {
                    currentUser = undefined;
                },
                requestUserProfile: function () {
                    var userProfileDeferred = $q.defer();

                    $http.get(BASE_URL + 'users/me')
                        .then(function (response) {
                            currentUser = response.data;
                            $cookies.put(ID_KEY, btoa(response.data.Id));
                            deferred.resolve(currentUser);
                            userProfileDeferred.resolve();
                        });

                    return userProfileDeferred.promise;
                }
            }
        }]);