'use strict';

angular.module('issueSystem.projects.add', [
        'issueSystem.projects.service'
    ])
    .controller('ProjectsController', [
        '$scope',
        function ($scope) {
            $scope.getProjectById(projectId)
                .then(function (projectData) {
                    $scope.projectData = projectData;
                }, function () {
                    notifyService.showError('Cannot load this project', err);
                })
        }
    ]
);