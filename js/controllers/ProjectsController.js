'use strict';

angular.module('issueSystem.projects', [
        'issueSystem.projects.projectsService',
        'issueSystem.users.usersService',
        'issueSystem.labels.labelsService'
    ])
    .controller('ProjectsController', [
        '$scope',
        '$route',
        'projectsService',
        '$routeParams',
        '$location',
        'authentication',
        'notifyService',
        'usersService',
        'labelsService',
        function ($scope, $route, projectsService, $routeParams, $location, authentication, notifyService, usersService, labelsService) {
            $scope.projectData = {};
            $scope.isAdmin = authentication.isAdmin();

            var location = $location.path();
            if(location === '/projects/add') {
                getAllUsers();
                getAllLabels();
            }

            function getProjectById(id) {
                projectsService.getProjectById(id)
                    .then(function (projectData) {
                        getIssuesForProject($routeParams.id);
                        getAllUsers();
                        loadFilters();
                        $scope.isCurrentUserProjectLead = projectData.Lead.Id === authentication.getUserId();
                        $scope.projectData = projectData;
                        $scope.projectData.LabelNames = joinProperties(projectData.Labels);
                        $scope.projectData.PriorityNames = joinProperties(projectData.Priorities);
                    }, function (err) {
                        notifyService.showError('Cannot load project', err);
                    });
            }

            function getIssuesForProject(projectId, filter) {
                projectsService.getIssuesForProject(projectId, filter)
                    .then(function (issues) {
                        $scope.projectData.issues = issues.data.Issues;
                        $scope.issuesNone = issues.data.Issues.length === 0;
                    });
            }

            $scope.filterIssues = function(projectId) {
                var filter = $scope.defaultFilter;
                getIssuesForProject(projectId, filter);
            };

            $scope.editProject = function (projectData) {
                projectsService.updateProject(projectData,
                    function success() {
                        notifyService.showInfo('You have successfully edited the project');
                        $location.path('/projects/' + projectData.Id);
                    }, function error(err) {
                        notifyService.showError('Editing the project failed', err);
                    })
            };

            $scope.addProject = function (projectData) {
                projectsService.createProject(projectData,
                    function success(data) {
                        notifyService.showInfo('You have successfully created a project');
                        $location.path('/projects/' + data.Id);
                    }, function error(err) {
                        notifyService.showError('Creating the project failed', err);
                    })
            };

            $scope.joinProperties = function (array) {
                if(array !== undefined) {
                    var result = array.map(function (element) {
                        return element.Name
                    }).join(", ");

                    return result;
                }
            };

            function getAllUsers() {
                usersService.getAllUsers()
                    .then(function (users) {
                        $scope.users = users
                    });
            }

            function getAllLabels() {
                labelsService.getAllLabels()
                    .then(function (labels) {
                        $scope.labels = labels;
                    });
            }

            function loadFilters() {
                $scope.defaultFilter = 'My Issues';
                $scope.filters = [];
                $scope.filters.push('My Issues');
                $scope.filters.push('All Issues');
                $scope.filters.push('Open Issues');
                $scope.filters.push('In Progress Issues');
                $scope.filters.push('Stopped Progress Issues');
                $scope.filters.push('Closed Issues');
                $scope.filters.push('Due Until Today');
            }

            function getAllProjects() {
                projectsService.getAllProjects(
                    $scope.projectsParams,
                    function success(data) {
                        $scope.projects = data;
                        $scope.projectsNone = data.Projects.length === 0;
                    }
                );
            }

            function joinProperties(array) {
                if(array !== undefined) {
                    var result = array.map(function (element) {
                        return element.Name
                    }).join(", ");

                    return result;
                }
            }

            if($routeParams.id) {
                getProjectById($routeParams.id);
            } else {
                $scope.projectsParams = {
                    'pageNumber' : 1,
                    'pageSize' : 7,
                    'filter': ''
                };

                $scope.reloadProjects = getAllProjects;
                $scope.reloadProjects();
            }
        }
    ]
);