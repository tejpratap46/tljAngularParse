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
    
    var comment = Parse.Object.extend("Comment");
    var query = new Parse.Query(comment);
    
    $('.notification').first().text('Loading...').show('fast');
    query.descending("votes");
    query.descending("updatedAt");
    query.equalTo("tmdb_id", $routeParams.id);
    query.find({
    success: function(results) {
        var commentsTemp = [];
        $scope.comments = [];
        console.log(results);
        results.forEach(function(object){
            commentsTemp.push({
                text: object.get('text'),
                username: object.get('username'),
                votes: object.get('votes')
            });
        });
        commentsTemp.forEach(function(object){
            $scope.comments.push(object);
            $scope.$apply();
        });
        
        $('.notification').first().hide('fast');
    },
    error: function(error) {
        $('.notification').first().text('Error ' + error.message).show('fast').delay(3000).hide('fast');}
    });
    
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
        addComment(tmdb_id,commentText);
    }
});