'use strict';

angular.module('issueSystem.users.authentication', [])
    .factory('authentication', [
        '$http',
        '$q',
        'BASE_URL_API',
        function($http, $q, BASE_URL_API) {
            console.log(BASE_URL_API);

            function registerUser(user) {
                var deferred = $q.defer();

                $http.post(BASE_URL_API + 'Account/Register', user)
                    .then(function (response) {
                        sessionStorage['currentUser'] = JSON.stringify(response.data);
                        deferred.resolve(response.data);
                    }, function (error) {
                        deferred.reject(error.data);
                    });

                return deferred.promise;
            }

            function loginUser(user) {
                var loginData = 'Username=' + user.username +
                              '&Password=' + user.password +
                              '&grant_type=password';

                var request = {
                    method: 'POST',
                    url: BASE_URL_API + 'Token',
                    data: loginData,
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                };

                var deferred = $q.defer();

                $http(request)
                    .then(function (response) {
                        sessionStorage['currentUser'] = JSON.stringify(response.data);
                        deferred.resolve(response.data);
                    }, function (error) {
                        deferred.reject(error.data);
                    });

                return deferred.promise;
            }

            function logout() {
                delete sessionStorage['currentUser'];
            }

            function isLoggedIn() {
                var isLoggedIn = sessionStorage['currentUser'] != undefined;

                return isLoggedIn;
            }

            function isAnonymous() {
                var isAnonymous = sessionStorage['currentUser'] == undefined

                return isAnonymous;
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

            function getCurrentUser() {
                var user = sessionStorage['currentUser'];
                if(user) {
                    return JSON.parse(user);
                }
            }

            function getAuthHeaders() {
                var headers = {};
                var user = this.getCurrentUser();
                if(user) {
                    headers['Authorization'] = 'Bearer ' + user.access_token;
                }
            }

            function getUserInfo() {
                var bearerToken = this.getAuthHeaders();

                var request = {
                    method: 'GET',
                    url: BASE_URL_API + 'users/me',
                    headers: {
                        'Authorization': bearerToken
                    }
                };

                var deferred = $q.defer();

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
                getCurrentUser: getCurrentUser,
                getAuthHeaders: getAuthHeaders,
                getUserInfo: getUserInfo
            }
    }]);