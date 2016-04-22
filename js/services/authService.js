'use strict';

angular.module('issueSystem.users.authentication', [])
    .factory('authentication', [
        '$http',
        '$q',
        'BASE_URL_API',
        'BASE_URL',
        function($http, $q, BASE_URL_API, BASE_URL) {
            function registerUser(user) {
                var deferred = $q.defer();

                $http.post(BASE_URL_API + 'Account/Register', user)
                    .then(function (response) {
                        sessionStorage['accessToken'] = response.data.access_token;
                        deferred.resolve(response.data);
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
                        sessionStorage['accessToken'] = response.data.access_token;
                        deferred.resolve(response.data);
                    }, function (error) {
                        deferred.reject(error.data);
                    });

                return deferred.promise;
            }

            function logout() {
                delete sessionStorage['accessToken'];
            }

            function isLoggedIn() {
                return sessionStorage['accessToken'] != undefined;
            }

            function isAnonymous() {

                return sessionStorage['accessToken'] == undefined;
            }

            function isNormalUser() {
                this.getUserInfo()
                    .then(function (userInfo) {
                        return !userInfo.isAdmin;
                    });
            }

            function isAdmin() {
                this.getUserInfo()
                    .then(function (userInfo) {
                        return userInfo.isAdmin;
                    });
            }

            function getAuthHeaders() {
                var headers = {},
                    bearerToken = sessionStorage['accessToken'];

                if(bearerToken) {
                    headers['Authorization'] = 'Bearer ' + bearerToken;
                }

                return headers['Authorization'];
            }

            function getUserInfo() {
                var bearerToken = this.getAuthHeaders(),
                    deferred = $q.defer(),
                    request = {
                        method: 'GET',
                        url: BASE_URL + 'users/me',
                        headers: {
                            'Authorization': bearerToken
                        }
                    };

                $http(request)
                    .then(function (response) {
                        deferred.resolve(response.data);
                    }, function (error) {
                        deferred.reject(error.data);
                    });

                return deferred.promise;
            }

            return {
                registerUser: registerUser,
                loginUser: loginUser,
                logout: logout,
                isLoggedIn: isLoggedIn,
                isAnonymous: isAnonymous,
                isNormalUser: isNormalUser,
                isAdmin: isAdmin,
                getAuthHeaders: getAuthHeaders,
                getUserInfo: getUserInfo
            }
    }]);