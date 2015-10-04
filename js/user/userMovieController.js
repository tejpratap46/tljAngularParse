app = angular.module('tlj');

app.controller('userMovieController', function($scope){
    
    var currentUser = Parse.User.current();
    if (currentUser) {
    }else{
        window.location.hash = '#/';
    }
    
    var MovieWatchList = Parse.Object.extend("MovieWatched");
    var query = new Parse.Query(MovieWatchList);
    
    $('.notification').first().text('Loading...').show('fast');
    
    query.equalTo("is_deleted", false);
    query.limit(1000);
    query.descending("updatedAt");
    query.find({
    success: function(results) {
        var moviesTemp = [];
        $scope.movies = [];
        userMoviesWatched = results;
        userMoviesWatchedNames = [];
        for (var i=0; i< results.length; i++){
            userMoviesWatchedNames.push(results[i].get('title'));
        }
        results.forEach(function(object){
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
            $scope.$apply();
        }
        $('.notification').first().hide('fast');
    },
    error: function(error) {
        $('.notification').first().text('Error ' + error).show('fast').delay(3000).hide('fast');}
    });
    
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