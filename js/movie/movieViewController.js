var app = angular.module('tlj');

app.controller('movieViewController', function($scope, $http, $routeParams){
    setNav('#navMovie');
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
    
    $scope.watchlist = function($index,movie){
        var genres = [];
        movie.genres.forEach(function(object){
            genres.push(object.id);
        })
        addMovieWatchlist($index,movie.id,movie.title,movie.poster_path,genres,movie.release_date,movie.vote_average);
    }
    
    $scope.watched = function($index,movie){
        var genres = [];
        movie.genres.forEach(function(object){
            genres.push(object.id);
        })
        addMovieWatched($index,movie.id,movie.title,movie.poster_path,genres,movie.release_date,movie.vote_average);
    }
    
    $scope.trailer = function($index,movie){
        showMovieTrailer($index,movie.id);
    }
    
    $scope.like = function($index,movie){
        var genres = [];
        movie.genres.forEach(function(object){
            genres.push(object.id);
        })
        addMovieLiked($index,movie.id,movie.title,movie.poster_path,genres,movie.release_date,movie.vote_average);
    }
});