'use strict';

angular.module('issueSystem.projects', [
        'issueSystem.projects.projectsService'
    ])
    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/', {
            templateUrl: 'templates/project-page.html',
            controller: 'ProjectsController'
        })
    }])
    .controller('ProjectsController', [
        '$scope',
        'projectsService',
        '$routeParams',
        function ($scope, projectsService, $routeParams) {
            $scope.projectData = {};

            function getProjectById(id) {
                projectsService.getProjectById(id)
                    .then(function (projectData) {
                        $scope.projectData = projectData;
                    }, function (err) {
                        notifyService.showError('Cannot load project', err);
                    });
            }

            getProjectById($routeParams.id);
        }
    ]
);