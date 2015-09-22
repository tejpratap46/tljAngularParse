var app = angular.module('tlj');

app.controller('movieViewController', function($scope, $http, $routeParams){
    setNav('#navMovie');
    $http.get("http://api.themoviedb.org/3/movie/" + $routeParams.id + "?api_key=" + tmdbapikey)
        .success(function(response) {
            var index1 = $.inArray(response.title, userMoviesWatchlist);
            if (index1 >= 0){
                response.watchlistClass = "btn-danger";
            }else{
                response.watchlistClass = "btn-success";
            }
            var index2 = $.inArray(response.title, userMoviesWatched);
            if (index2 >= 0){
                response.watchedClass = "btn-danger";
            }else{
                response.watchedClass = "btn-info";
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
                var index1 = $.inArray(response.results[i].title, userMoviesWatchlist);
                if (index1 >= 0){
                    response.results[i].watchlistClass = "btn-danger";
                }else{
                    response.results[i].watchlistClass = "btn-success";
                }
                var index2 = $.inArray(response.results[i].title, userMoviesWatched);
                if (index2 >= 0){
                    response.results[i].watchedClass = "btn-danger";
                }else{
                    response.results[i].watchedClass = "btn-info";
                }
                $scope.movies.push(response.results[i]);
                $scope.$apply;
            }
    });
    
    $scope.watchlist = function($index,tmdbid,imdbid,name,image){
        addMovieWatchlist($index,tmdbid,"",name,image);
    }
    
    $scope.watched = function($index,tmdbid,imdbid,name,image){
        addMovieWatched($index,tmdbid,"",name,image);
    }
    
    $scope.trailer = function($index,tmdbid){
        showMovieTrailer($index,tmdbid);
    }
});