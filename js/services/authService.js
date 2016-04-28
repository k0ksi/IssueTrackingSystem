'use strict';

angular.module('issueSystem.users.authentication', [])
    .factory('authentication', [
        '$http',
        '$cookies',
        '$q',
        '$location',
        'identity',
        'BASE_URL_API',
        'BASE_URL',
        function($http, $cookies, $q, $location, identity, BASE_URL_API) {
            var AUTHENTICATION_COOKIE_KEY = '!__Authentication_Cookie_Key_!',
                ID_KEY = '!__Id_Cookie_Key_!';

            function preserveUserData(data) {
                var accessToken = data.access_token;
                $http.defaults.headers.common.Authorization = 'Bearer ' + accessToken;
                $cookies.put(AUTHENTICATION_COOKIE_KEY, btoa(accessToken));
            }

            function registerUser(user) {
                var deferred = $q.defer();

                $http.post(BASE_URL_API + 'Account/Register', user)
                    .then(function (response) {
                        preserveUserData(response.data);

                        identity.requestUserProfile()
                            .then(function () {
                                deferred.resolve(response.data);
                            });
                    }, function (error) {
                        deferred.reject(error.data);
                    });

                return deferred.promise;
            }

            function loginUser(user) {
                var loginData = 'Username=' + user.username +
                              '&Password=' + user.password +
                              '&grant_type=password',
                    deferred = $q.defer(),
                    request = {
                        method: 'POST',
                        url: BASE_URL_API + 'Token',
                        data: loginData,
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded'
                        }
                    };

                $http(request)
                    .then(function (response) {
                        preserveUserData(response.data);

                        identity.requestUserProfile()
                            .then(function () {
                                deferred.resolve(response.data);
                            });
                    }, function (error) {
                        deferred.reject(error.data);
                    });

                return deferred.promise;
            }

            function isAuthenticated() {
                var isAuthenticated = !!$cookies.get(AUTHENTICATION_COOKIE_KEY);

                return isAuthenticated;
            }

            function logout() {
                $cookies.remove(AUTHENTICATION_COOKIE_KEY);
                $http.defaults.headers.common.Authorization = undefined;
                identity.removeUserProfile();
                $location.path('/');
            }

            function getAuthHeaders() {
                return $http.defaults.headers.common.Authorization;
            }

            function refreshCookie() {
                if(isAuthenticated()) {
                    $http.defaults.headers.common.Authorization = 'Bearer ' + atob($cookies.get(AUTHENTICATION_COOKIE_KEY));
                    identity.requestUserProfile();
                }
            }

            function getUserId() {
                return atob($cookies.get(ID_KEY));
            }

            return {
                registerUser: registerUser,
                loginUser: loginUser,
                logout: logout,
                getAuthHeaders: getAuthHeaders,
                isAuthenticated: isAuthenticated,
                refreshCookie: refreshCookie,
                getUserId: getUserId
            }
    }]);