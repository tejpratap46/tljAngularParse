var app = angular.module('tlj');

app.registerCtrl('postHomeController', ['$scope', '$routeParams', '$window', function($scope, $routeParams, $window){
    document.title = 'View Post';
	setNav('#navHome');
    $scope.isLoadingComplete = false;
    var user = Parse.User.current();
    if (user == null){
        window.location.hash = "/";
    }

    var page = 0;
    $scope.getPost = getPost($routeParams.id);
    $scope.getComments = getComments($routeParams.id, (++page));

    function getPost(id){
        var Comment = Parse.Object.extend("Comment");
        var query = new Parse.Query(Comment);
        query.include("created_by");
        $('.notification').first().text('Loading...').show('fast');
        query.get(id, {
            success: function(comment) {
            $scope.isLoadingComplete = true;
            $('.notification').first().hide('fast');
            $scope.post = comment.toJSON();
            $scope.post.timeString = moment($scope.post.createdAt).fromNow();
            $scope.post.timeTitle = moment($scope.post.createdAt).format('MMMM Do YYYY, h:mm a');
            if ($scope.post.text){
                $scope.post.postAction = " Commented On ";
            };
            $scope.post.voted_by = "";
            if (comment.get('voted_by')) {
                var votedByTemp = comment.get('voted_by');
                if (votedByTemp.length == 0){
                    $scope.post.voted_by = "Be first like this";
                    $scope.post.commentLikedClass = "link";
                }else if (votedByTemp.indexOf(user.id) >= 0){
                    if (votedByTemp.length == 1){
                        $scope.post.voted_by = "you liked this";
                        $scope.post.commentLikedClass = "primary";
                    }
                    else{
                        $scope.post.commentLikedClass = "primary";
                        $scope.post.voted_by = "you and " + (votedByTemp.length - 1) + " other liked this";
                    }
                }else{
                    $scope.post.voted_by = votedByTemp.length + " people liked this";
                    $scope.post.commentLikedClass = "link";
                }
            }else{
                $scope.post.voted_by = "Be first like this";
                $scope.post.commentLikedClass = "link";
            }
            $scope.post.sub_comments_count = 0;
            if (comment.get("sub_comment")) {
                $scope.post.sub_comments_count = comment.get("sub_comment").length;
            }
            var index = $.inArray($scope.post.tmdb_id, userMoviesWatchlistNames);
            if (index >= 0){
                $scope.post.watchlistClass = "btn-danger";
            }else{
                $scope.post.watchlistClass = "btn-success";
            }
            index = $.inArray($scope.post.tmdb_id, userMoviesWatchedNames);
            if (index >= 0){
                $scope.post.watchedClass = "btn-danger";
            }else{
                $scope.post.watchedClass = "btn-info";
            }
            index = $.inArray($scope.post.tmdb_id, userMoviesLikedNames);
            if (index >= 0){
                $scope.post.likedClass = "btn-danger";
            }else{
                $scope.post.likedClass = "btn-warning";
            }
            $scope.$apply();
        },
        error: function(error) {
        }
        });
    }

    function getComments(id,page){
        $('.notification').first().text('Loading...').show('fast');
        console.log("id : " + id + ", page : " + page);
        Parse.Cloud.run('getSubComments', {id: '3WYiZVpFTI', page: page, limit: 6},{
        success: function(results) {
            $('.notification').first().hide('fast');
            if (!$scope.post.sub_comment) {
                $scope.post.sub_comment = [];
            }
            results.forEach(function(object){
                $scope.post.sub_comment.push({
                    userId: object.get("created_by").id,
                    username: object.get("created_by").get("name"),
                    commentText: object.get("text")
                });
            });
            $scope.$apply();
        },
        error: function(error) {
            $('.notification').first().hide('fast');
            // $('.notification').first().text('Error ' + error.message).show('fast').delay(3000).hide('fast');
        }
    });
    }

    $scope.upvote = function(id){
        var Comment = Parse.Object.extend("Comment");
        var query = new Parse.Query(Comment);
        $('.notification').first().text('Loading...').show('fast');
        query.get(id, {
            success: function(comment) {
            $('.notification').first().hide('fast');
            if (comment.get('voted_by')) {
                if (comment.get('voted_by').indexOf(user.id) >= 0){
                    // Remove like
                    $scope.post.commentLikedClass = "link";
                    comment.remove("voted_by", user.id);
                    comment.set(comment.get("votes")-1);
                }else{
                    // Add like
                    $scope.post.commentLikedClass = "primary";
                    comment.addUnique("voted_by", user.id);
                    comment.increment("votes");
                }
            }else{
                $scope.post.commentLikedClass = "primary";
                comment.addUnique("voted_by", user.id);
                comment.increment("votes");
            }
            $scope.$apply();
            comment.save(null, {
                success: function(comment) {
                    var votedByTemp = comment.get('voted_by');
                    $scope.post.voted_by = "";
                    if (votedByTemp.length == 0){
                        $scope.post.voted_by = "Be first like this";
                    }else if (votedByTemp.indexOf(user.id) >= 0){
                        if (votedByTemp.length == 1){
                            $scope.post.voted_by = "  you liked this";
                        }else{
                            $scope.post.voted_by = "  you and " + (votedByTemp.length - 1) + " other liked this";
                        }
                    }else{
                        $scope.post.voted_by = "  " + votedByTemp.length + " people liked this";
                    }
                    $scope.$apply();
                },
                error: function(comment, error) {
                }
            });
        },
        error: function(error) {
        }
        });
    }

    $scope.writeComment = function(post){
        var Comment = Parse.Object.extend("Comment");
        var parentComment = new Comment();
        parentComment.id = post.objectId;
        var subComment = new Comment();
        subComment.set("parent_comment", parentComment);
        subComment.set("created_by", user);
        subComment.set("username", user.get('username'));
        subComment.set("text", post.commentText);
        subComment.save(null, {
        success: function(subComment) {
                parentComment.add("sub_comment", subComment);
                parentComment.save();
            }
        });
        var subCmt = {};
        if (!post.sub_comment) {
            post.sub_comment = [];
        }
        subCmt.userId = user.id;
        subCmt.username =  user.get('name');
        subCmt.commentText =  post.commentText
        post.sub_comment.push(subCmt);
        post.sub_comments_count += 1;
        post.commentText = "";
        $scope.$apply();
    }
}]);