var app = angular.module('tlj');

app.registerCtrl('movieViewController', ['$scope', '$http', '$routeParams', function($scope, $http, $routeParams){
	setNav('#navStart');
    document.title = $routeParams.name;
    $('html,body').scrollTop(0);
    $http.get("http://api.themoviedb.org/3/movie/" + $routeParams.id + "?api_key=" + tmdbapikey)
        .success(function(response) {
            $scope.movie = response;
            var index = $.inArray(response.title, userMoviesWatchlistNames);
            if (index >= 0){
                response.watchlistClass = "btn-danger";
            }else{
                response.watchlistClass = "btn-success";
            }
            index = $.inArray(response.title, userMoviesWatchedNames);
            if (index >= 0){
                response.watchedClass = "btn-danger";
            }else{
                response.watchedClass = "btn-info";
            }
            index = $.inArray(response.title, userMoviesLikedNames);
            if (index >= 0){
                response.likedClass = "btn-danger";
            }else{
                response.likedClass = "btn-warning";
            }
            $scope.movie = response;
    });
    $http.get("http://api.themoviedb.org/3/movie/" + $routeParams.id + "/credits?api_key=" + tmdbapikey)
        .success(function(response) {
            $scope.casts = response.cast;
    });
    $http.get("http://api.themoviedb.org/3/movie/" + $routeParams.id + "/similar?api_key=" + tmdbapikey)
        .success(function(response) {
            $scope.movies = [];
            for (var i=0; i<response.results.length; i++){
                var index = $.inArray(response.results[i].title, userMoviesWatchlistNames);
                if (index >= 0){
                    response.results[i].watchlistClass = "btn-danger";
                }else{
                    response.results[i].watchlistClass = "btn-success";
                }
                index = $.inArray(response.results[i].title, userMoviesWatchedNames);
                if (index >= 0){
                    response.results[i].watchedClass = "btn-danger";
                }else{
                    response.results[i].watchedClass = "btn-info";
                }
                index = $.inArray(response.results[i].title, userMoviesLikedNames);
                if (index >= 0){
                    response.results[i].likedClass = "btn-danger";
                }else{
                    response.results[i].likedClass = "btn-warning";
                }
                $scope.movies.push(response.results[i]);
                $scope.$apply;
            }
    });
    
    $scope.loadComments = loadComments();
    
    function loadComments(){
        var comment = Parse.Object.extend("Comment");
        var query = new Parse.Query(comment);

        query.descending("votes");
        query.descending("createdAt");
        query.limit(10);
        query.equalTo("tmdb_id", $routeParams.id);
        query.find({
        success: function(results) {
            var commentsTemp = [];
            $scope.comments = [];
            results.forEach(function(object){
                var votedByTemp = object.get('voted_by');
                var user = Parse.User.current();
                var votedBy = "";
                if (votedByTemp.length == 0){
                    votedBy = "";
                }else if (votedByTemp.indexOf(user.get("username")) >= 0){
                    if (votedByTemp.length == 1)
                        votedBy = "you liked this";
                    else
                        votedBy = "you and " + (votedByTemp.length - 1) + " other liked this";
                }else{
                    votedBy = votedByTemp.length + " people liked this";
                }
                var updatedAtString = "";
                var updatedAt = object.get('updatedAt');
                var currentDate = new Date();
                var timeDifference = currentDate.getTime() - updatedAt.getTime();
                if(timeDifference > 86400000){
                    var days = Math.round(timeDifference/86400000);
                    updatedAtString = days + " day" + (days<2?'':'s') + " ago";
                }else{
                    updatedAtString = "Today at" + (updatedAt.getHours()%12 || 12) + ":" +((updatedAt.getMinutes()<10?'0':'') + updatedAt.getMinutes()) + " " + (updatedAt.getHours()<12?'AM':'PM');
                }
                commentsTemp.push({
                    id: object.id,
                    text: object.get('text'),
                    username: object.get('username'),
                    voted_by: votedBy,
                    votes: object.get('votes'),
                    updatedAt: updatedAtString
                });
            });
            commentsTemp.forEach(function(object){
                $scope.comments.push(object);
                $scope.$apply();
            });
        },
        error: function(error) {
            $('.notification').first().text('Error ' + error.message).show('fast').delay(3000).hide('fast');}
        });
    }
    
    $scope.watchlist = function($index,movie){
        var genres = [];
        if ($index > -1){
            genres = movie.genre_ids;
        }else{
            movie.genres.forEach(function(object){
                genres.push(object.id);
            })
        }
        addMovieWatchlist($index,movie.id,movie.title,movie.poster_path,genres,movie.release_date,movie.vote_average);
    }
    
    $scope.watched = function($index,movie){
        var genres = [];
        if ($index > -1){
            genres = movie.genre_ids;
        }else{
            movie.genres.forEach(function(object){
                genres.push(object.id);
            })
        }
        addMovieWatched($index,movie.id,movie.title,movie.poster_path,genres,movie.release_date,movie.vote_average);
    }
    
    $scope.trailer = function($index,movie){
        showMovieTrailer($index,movie.id);
    }
    
    $scope.like = function($index,movie){
        var genres = [];
        if ($index > -1){
            genres = movie.genre_ids;
        }else{
            movie.genres.forEach(function(object){
                genres.push(object.id);
            })
        }
        addMovieLiked($index,movie.id,movie.title,movie.poster_path,genres,movie.release_date,movie.vote_average);
    }
    
    $scope.addComment = function(){
        var movie = $scope.movie;
        var commentText = $scope.commentText;
        $scope.commentText = "";
        if(commentText.length == 0){
            return;
        }
        var Comment = Parse.Object.extend("Comment");
        var comment = new Comment();
        comment.set("tmdb_id", movie.id + "");
        comment.set("text", commentText);
        comment.set("poster_path", movie.poster_path);
        comment.set("title", movie.title);
        comment.set("genre", movie.genre_ids);
        comment.set("release_date", movie.release_date);
        comment.set("vote_average", movie.vote_average);
        comment.increment("votes");
        var user = Parse.User.current();
        if (user == null){
            eModal.confirm("Create a account in just 10 sec, and track all your entertainment life.", "Login").then(loginOk, loginCancel);
            return false;
        }
        // no problem, add comment
        var name = user.get("username");
        comment.set("username", name);
        comment.addUnique("voted_by", name);
        $('.notification').first().text('Adding...').show('fast');
        comment.save(null, {
            success: function(comment) {
                $('.notification').first().hide('fast');
                $scope.loadComments = loadComments();
                addMovieWatchedSilent(-1,movie.id,movie.title,movie.poster_path,movie.genre_ids,movie.release_date,movie.vote_average);
            },
        error: function(comment, error) {
                $('.notification').first().text('Oops! ' + error.message).show('fast').delay(3000).hide('fast');
            }
        });
    }
    
    $scope.upvote = function(id){
        var Comment = Parse.Object.extend("Comment");
        var query = new Parse.Query(Comment);
        query.get(id, {
            success: function(comment) {
            var user = Parse.User.current();
            if (user == null){
                eModal.confirm("Create a account in just 10 sec, and track all your entertainment life.", "Login").then(loginOk, loginCancel);
                return false;
            }else{
                // no problem, add comment
                var name = user.get("username");
                comment.addUnique("voted_by", name);
                comment.increment("votes");
                comment.save(null, {
                    success: function(comment) {
                        $scope.loadComments = loadComments();
                    },
                error: function(comment, error) {
                    }
                });
            }
        },
        error: function(error) {
        }
        });
    }
}]);