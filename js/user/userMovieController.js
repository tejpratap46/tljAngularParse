app = angular.module('tlj');

app.controller('userMovieController', function($scope){
    
    var currentUser = Parse.User.current();
    if (currentUser) {
        getUserMoviesWatchlist();
        getUserMoviesWatched();
        getUserMoviesLiked();
        console.log('loaded');
    }else{
        window.location.hash = '#/';
    }
    
    $scope.movies = [];
    var moviesTemp = [];
    userMoviesWatched.forEach(function(object){
        moviesTemp.push({
            title: object.get('title'),
            poster_path: object.get('poster_path'),
            vote_average: object.get('vote_average'),
            release_date: object.get('release_date'),
            id: object.get('tmdb_id')
            });
    });
    
    for(var i=0;i<moviesTemp.length;i++){
        var index = $.inArray(userMoviesWatched[i].get('title'), userMoviesWatchlistNames);
        if (index >= 0){
            moviesTemp[i].watchlistClass = "btn-danger";
        }else{
            moviesTemp[i].watchlistClass = "btn-success";
        }
        index = $.inArray(userMoviesWatched[i].get('title'), userMoviesWatchedNames);
        if (index >= 0){
            moviesTemp[i].watchedClass = "btn-danger";
        }else{
            moviesTemp[i].watchedClass = "btn-info";
        }
        index = $.inArray(userMoviesWatched[i].get('title'), userMoviesLikedNames);
        if (index >= 0){
            moviesTemp[i].likedClass = "btn-danger";
        }else{
            moviesTemp[i].likedClass = "btn-warning";
        }
        $scope.movies.push(moviesTemp[i]);
        $scope.$apply;
    }
    
    $scope.watchlist = function($index,movie){
        addMovieWatchlist($index,movie.id,movie.title,movie.poster_path,movie.genre_ids,movie.release_date,movie.vote_average);
    }
    
    $scope.watched = function($index,movie){
        addMovieWatched($index,movie.id,movie.title,movie.poster_path,movie.genre_ids,movie.release_date,movie.vote_average);
    }
    
    $scope.trailer = function($index,movie){
        showMovieTrailer($index,movie.id);
    }
    
    $scope.like = function($index,movie){
        addMovieLiked($index,movie.id,movie.title,movie.poster_path,movie.genre_ids,movie.release_date,movie.vote_average);
    }
});