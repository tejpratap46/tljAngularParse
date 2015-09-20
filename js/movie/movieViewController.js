var app = angular.module('tlj');

app.controller('movieViewController', function($scope, $http, $routeParams){
    setNav('#navMovie');
    $http.get("http://api.themoviedb.org/3/movie/" + $routeParams.id + "?api_key=" + tmdbapikey)
        .success(function(response) {
            $scope.movie = response;
    });
    $http.get("http://api.themoviedb.org/3/movie/" + $routeParams.id + "/credits?api_key=" + tmdbapikey)
        .success(function(response) {
            $scope.casts = response.cast;
    });
    $http.get("http://api.themoviedb.org/3/movie/" + $routeParams.id + "/similar?api_key=" + tmdbapikey)
        .success(function(response) {
            $scope.movies = response.results;
    });
    
    $scope.watchlist = function($index,tmdbid,imdbid,name,image){
        addMovieWatchlist($index,tmdbid,"",name,image);
    }
    
    $scope.watched = function($index,tmdbid,imdbid,name,image){
        addMovieWatched($index,tmdbid,"",name,image);
    }
});