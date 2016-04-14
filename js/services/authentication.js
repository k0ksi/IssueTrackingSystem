'use strict';

angular.module('issueSystem.users.authentication', [])
    .factory('authentication', [
        '$http',
        '$q',
        'BASE_URL',
        function($http, $q, BASE_URL) {
            console.log(BASE_URL);

            function registerUser(user) {
                var deferred = $q.defer();

                $http.post(BASE_URL + 'Users/Register', user)
                    .then(function (response) {
                        deferred.resolve(response.data);
                    }, function (error) {

                    });

                return deferred.promise;
            }

            function loginUser(user) {
                var loginData = 'Username=' + user.username +
                              '&Password=' + user.password +
                              '&grant_type=password';

                var request = {
                    method: 'POST',
                    url: BASE_URL + 'Token',
                    data: loginData,
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                };

                var deferred = $q.defer();

                $http(request)
                    .then(function (response) {
                        deferred.resolve(response.data);
                    }, function (error) {

                    });

                return deferred.promise;
            }

            function logout() {

            }

            function isLoggedIn() {

            }

            function isNormalUser() {

            }

            function isAdmin() {

            }

            function getAuthHeaders() {

            }

            return {
                registerUser: registerUser,
                loginUser: loginUser,
                logout: logout
            }
    }]);