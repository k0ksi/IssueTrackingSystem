angular.module('issueSystem.common', [])
    .controller('MainController', [
        '$scope',
        'identity',
        function($scope, identity) {
            identity.getCurrentUser()
                .then(function(user) {
                    $scope.currentUser = user;
                    $scope.isAuthenticated = true;
                });
        }]);