'use strict';

angular.module('issueSystem.comments.commentsService', [])
    .factory('commentsService', [
        '$http',
        'BASE_URL',
        function ($http, BASE_URL) {
            function addComment(issueId, commentData) {
                var request = {
                    method: 'POST',
                    url: BASE_URL + 'issues/' + issueId + '/comments',
                    data: commentData
                };

                $http(request).success(success).error(error);
            }

            return {
                addComment: addComment
            }
        }
    ]);