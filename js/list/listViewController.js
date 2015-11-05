var app = angular.module('tlj');

app.controller('listViewController', function($scope, $routeParams, $window){
	setNav('#navHome');
    var page = 0;
    $scope.movies = [];
    $routeParams.id = typeof $routeParams.id !== 'undefined' ? $routeParams.id : 'MovieWatched';
    $routeParams.genre = typeof $routeParams.genre !== 'undefined' ? $routeParams.genre : 0;
    $routeParams.genre = parseInt($routeParams.genre);
    $scope.loadMovies = loadMovies();
    angular.element($window).bind("scroll", function() {
        var windowHeight = "innerHeight" in window ? window.innerHeight : document.documentElement.offsetHeight;
        var body = document.body, html = document.documentElement;
        var docHeight = Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight,  html.scrollHeight, html.offsetHeight);
        windowBottom = windowHeight + window.pageYOffset;
        if (windowBottom >= docHeight - 100) {
            $scope.loadMovies = loadMovies();
        }
    });
    
    function loadMovies(){
        $('.notification').first().text('Loading...').show('fast');
        Parse.Cloud.run('getListMovies', {list_id: $routeParams.id, limit: 24, page: (++page)}, {
            success: function(results) {
                $('.notification').first().hide('fast');
                var moviesTemp = [];
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
            },
            error: function(error) {
                $('.notification').first().text('Error : ' + error.message).show('fast').delay(3000).hide('fast');
            }
        });
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