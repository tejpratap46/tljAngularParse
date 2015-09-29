var app = angular.module('tlj');

app.controller('movieListController', function($scope, $window, $http, $routeParams){
	setNav('#navMovie');
    
    var page = 0;
    angular.element($window).bind("scroll", function() {
        var windowHeight = "innerHeight" in window ? window.innerHeight : document.documentElement.offsetHeight;
        var body = document.body, html = document.documentElement;
        var docHeight = Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight,  html.scrollHeight, html.offsetHeight);
        windowBottom = windowHeight + window.pageYOffset;
        if (windowBottom >= docHeight - 10) {
            if ($routeParams.list == 'list'){
                $('.notification').first().text('Loading More...').show('fast');
                $http.get("http://api.themoviedb.org/3/movie/" + $routeParams.id + "?api_key=" + tmdbapikey + "&page=" + (++page))
                .success(function(response) {
                    $('.notification').first().hide('fast');
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
            }else if($routeParams.list == 'genre'){
                $('.notification').first().text('Loading More...').show('fast');
                $http.get("http://api.themoviedb.org/3/genre/" + $routeParams.id + "/movies?api_key=" + tmdbapikey + "&page=" + (++page))
                .success(function(response) {
                    $('.notification').first().hide('fast');
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
            }else if($routeParams.list == 'search'){
                $('.notification').first().text('Loading More...').show('fast');
                $http.get("http://api.themoviedb.org/3/search/movie?query=" + $routeParams.id + "/&api_key=" + tmdbapikey + "&page=" + (++page))
                .success(function(response) {
                    $('.notification').first().hide('fast');
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
            }else if($routeParams.list == 'discover'){
                $('.notification').first().text('Loading More...').show('fast');
                 $http.get("http://api.themoviedb.org/3/discover/movie?sort_by=" + $routeParams.id + "&api_key=" + tmdbapikey + "&page=" + (++page))
                    .success(function(response) {
                    $('.notification').first().hide('fast');
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
            }
        }
    });
    
    if ($routeParams.list == 'list'){
        $('.notification').first().text('Loading ...').show('fast');
        $http.get("http://api.themoviedb.org/3/movie/" + $routeParams.id + "?api_key=" + tmdbapikey + "&page=" + (++page))
            .success(function(response) {
            $('.notification').first().hide('fast');
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
    }else if($routeParams.list == 'genre'){
        $('.notification').first().text('Loading ...').show('fast');
         $http.get("http://api.themoviedb.org/3/genre/" + $routeParams.id + "/movies?api_key=" + tmdbapikey + "&page=" + (++page))
            .success(function(response) {
            $('.notification').first().hide('fast');
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
    }else if($routeParams.list == 'search'){
        $('.notification').first().text('Loading ...').show('fast');
         $http.get("http://api.themoviedb.org/3/search/movie?query=" + $routeParams.id + "/&api_key=" + tmdbapikey + "&page=" + (++page))
            .success(function(response) {
            $('.notification').first().hide('fast');
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
    }else if($routeParams.list == 'discover'){
        $('.notification').first().text('Loading ...').show('fast');
         $http.get("http://api.themoviedb.org/3/discover/movie?sort_by=" + $routeParams.id + "&api_key=" + tmdbapikey + "&page=" + (++page))
            .success(function(response) {
            $('.notification').first().hide('fast');
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