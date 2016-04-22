angular.module('issueSystem.common', [
        'issueSystem.users.identity'
    ])
    .controller('MainController', [
        '$scope',
        'identity',
        function ($scope, identity) {
            identity.getCurrentUser()
                .then(function (user) {
                    $scope.currentUser = user;
                });

            $scope.isAuthenticated = identity.isAuthenticated();
        }]);