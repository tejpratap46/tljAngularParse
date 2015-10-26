var app = angular.module('tlj');

app.controller('movieViewController', function($scope, $http, $routeParams){
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
                console.log('created by : ' + votedByTemp.length);
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
                console.log(votedBy);
                commentsTemp.push({
                    id: object.id,
                    text: object.get('text'),
                    username: object.get('username'),
                    voted_by: votedBy,
                    votes: object.get('votes')
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
    
    $scope.addComment = function(tmdb_id){
        var commentText = $scope.commentText;
        if(commentText.length == 0){
            return;
        }
        var Comment = Parse.Object.extend("Comment");
        var comment = new Comment();
        comment.set("tmdb_id", tmdb_id + "");
        comment.set("text", commentText);
        comment.increment("votes");
        var user = Parse.User.current();
        if (user == null){
            eModal.confirm("Create a account in just 10 sec, and track all your entertainment life.", "Login").then(loginOk, loginCancel);
            return false;
        }
        // no problem, add comment
        var name = user.get("username");
        comment.set("comment_by", name);

        $('.notification').first().text('Adding...').show('fast');
        comment.save(null, {
            success: function(comment) {
                $('.notification').first().hide('fast');
                $scope.loadComments = loadComments();
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
});