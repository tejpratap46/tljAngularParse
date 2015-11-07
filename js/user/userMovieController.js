app = angular.module('tlj');

app.controller('userMovieController', function($scope, $routeParams){
    
    var currentUser = Parse.User.current();
    if (currentUser) {
        $scope.username = currentUser.get('username');
    }else{
        window.location.hash = '#/';
    }
    
    $routeParams.genre = typeof $routeParams.genre !== 'undefined' ? $routeParams.genre : '';
    $routeParams.genre = parseInt($routeParams.genre);
    console.log($routeParams.genre.length > 0);
    $routeParams.username = typeof $routeParams.username !== 'undefined' ? $routeParams.username : $scope.username;
    
    $('.notification').first().text('Loading...').show('fast');
    Parse.Cloud.run('getMovie', {className: $routeParams.category, limit: 1000, page: 1, genre: $routeParams.genre, username: $routeParams.username},{
    success: function(results) {
        var moviesTemp = [];
        $scope.movies = [];
        if($routeParams.category == 'MovieWatched'){
            userMoviesWatched = results;
            userMoviesWatchedNames = [];
            for (var i=0; i< results.length; i++){
                userMoviesWatchedNames.push(results[i].get('title'));
            }
        }else if($routeParams.category == 'MovieWatchList'){
            userMoviesWatchlist = results;
            userMoviesWatchlistNames = [];
            for (var i=0; i< results.length; i++){
                userMoviesWatchlistNames.push(results[i].get('title'));
            }
        }else if($routeParams.category == 'MovieLiked'){
            userMoviesLiked = results;
            userMoviesLikedNames = [];
            for (var i=0; i< results.length; i++){
                userMoviesLikedNames.push(results[i].get('title'));
            }
        }
        results.forEach(function(object){
            moviesTemp.push({
                title: object.get('title'),
                poster_path: object.get('poster_path'),
                vote_average: object.get('vote_average'),
                release_date: object.get('release_date'),
                genre_ids: object.get('genre'),
                id: object.get('tmdb_id')
            });
        });
        
        for(var i=0;i<moviesTemp.length;i++){
            var index = $.inArray(moviesTemp[i]['title'], userMoviesWatchlistNames);
            if (index >= 0){
                moviesTemp[i].watchlistClass = "btn-danger";
            }else{
                moviesTemp[i].watchlistClass = "btn-success";
            }
            index = $.inArray(moviesTemp[i]['title'], userMoviesWatchedNames);
            if (index >= 0){
                moviesTemp[i].watchedClass = "btn-danger";
            }else{
                moviesTemp[i].watchedClass = "btn-info";
            }
            index = $.inArray(moviesTemp[i]['title'], userMoviesLikedNames);
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
        $('.notification').first().text('Error ' + error.message).show('fast').delay(3000).hide('fast');}
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