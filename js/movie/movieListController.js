var app = angular.module('tlj');

app.controller('movieListController', function($scope, $window, $http, $routeParams){
	setNav('#navMovie');
    
    if ($routeParams.list == 'discover'){
        $routeParams.genre = typeof $routeParams.genre !== 'undefined' ? $routeParams.genre : '';
        $routeParams.rating = typeof $routeParams.rating !== 'undefined' ? $routeParams.rating : '1';
        $scope.minMovieRating = $routeParams.rating;
        $scope.filterName = ["Short By", "Genre"];
        $scope.filters = [
            {
                "data":[
                    {"url":"popularity.desc/" + $routeParams.genre + "/" +  $routeParams.rating, "name":"Popular first"},
                    {"url":"popularity.asc/" + $routeParams.genre + "/" +  $routeParams.rating, "name":"Popular last"},
                    {"url":"release_date.desc/" + $routeParams.genre + "/" +  $routeParams.rating, "name":"New Released first"},
                    {"url":"release_date.asc/" + $routeParams.genre + "/" +  $routeParams.rating, "name":"New Released last"},
                    {"url":"revenue.desc/" + $routeParams.genre + "/" +  $routeParams.rating, "name":"Highest Revenue first"},
                    {"url":"revenue.asc/" + $routeParams.genre + "/" +  $routeParams.rating, "name":"Lowest Revenue first"},
                    {"url":"vote_average.desc/" + $routeParams.genre + "/" +  $routeParams.rating, "name":"Best Rating first"},
                    {"url":"vote_count.desc/" + $routeParams.genre + "/" +  $routeParams.rating, "name":"Most Voted first"}
                ]
            },
            {
                "data":[
                    {"url":$routeParams.id + "/28" + "/" +  $routeParams.rating, "name":"Action"},
                    {"url":$routeParams.id + "/12" + "/" +  $routeParams.rating, "name":"Adventure"},
                    {"url":$routeParams.id + "/16" + "/" +  $routeParams.rating, "name":"Animation"},
                    {"url":$routeParams.id + "/35" + "/" +  $routeParams.rating, "name":"Comedy"},
                    {"url":$routeParams.id + "/80" + "/" +  $routeParams.rating, "name":"Crime"},
                    {"url":$routeParams.id + "/99" + "/" +  $routeParams.rating, "name":"Documentary"},
                    {"url":$routeParams.id + "/18" + "/" +  $routeParams.rating, "name":"Drama"},
                    {"url":$routeParams.id + "/10751" + "/" +  $routeParams.rating, "name":"Family"},
                    {"url":$routeParams.id + "/14" + "/" +  $routeParams.rating, "name":"Fantasy"},
                    {"url":$routeParams.id + "/10769" + "/" +  $routeParams.rating, "name":"Foreign"},
                    {"url":$routeParams.id + "/36" + "/" +  $routeParams.rating, "name":"History"},
                    {"url":$routeParams.id + "/27" + "/" +  $routeParams.rating, "name":"Horror"},
                    {"url":$routeParams.id + "/10402" + "/" +  $routeParams.rating, "name":"Music"},
                    {"url":$routeParams.id + "/9648" + "/" +  $routeParams.rating, "name":"Mystery"},
                    {"url":$routeParams.id + "/10749" + "/" +  $routeParams.rating, "name":"Romance"},
                    {"url":$routeParams.id + "/878" + "/" +  $routeParams.rating, "name":"Science Fiction"},
                    {"url":$routeParams.id + "/10770" + "/" +  $routeParams.rating, "name":"TV Movie"},
                    {"url":$routeParams.id + "/53" + "/" +  $routeParams.rating, "name":"Thriller"},
                    {"url":$routeParams.id + "/10752" + "/" +  $routeParams.rating, "name":"War"},
                    {"url":$routeParams.id + "/37" + "/" +  $routeParams.rating, "name":"Western"}
                ]
            }
        ];
        $scope.$apply();
        $('#discover-filter').show();
    }else{
        $('#discover-filter').hide();
    }
    
    $scope.minMovieRatingChanged = function(){
        window.location.hash = "#/movie/list/discover/" + $routeParams.id + "/" + $routeParams.genre + "/" + $scope.minMovieRating;
    }
    
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
                        $scope.$apply();
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
                        $scope.$apply();
                    }
                });
            }else if($routeParams.list == 'search'){
                $('.notification').first().text('Loading More...').show('fast');
                $http.get("http://api.themoviedb.org/3/search/movie?query=" + $routeParams.id + "&api_key=" + tmdbapikey + "&page=" + (++page))
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
                        $scope.$apply();
                    }
                });
            }else if($routeParams.list == 'discover'){
                $('.notification').first().text('Loading More...').show('fast');
                 $http.get("http://api.themoviedb.org/3/discover/movie?sort_by=" + $routeParams.id + "&with_genres=" + $routeParams.genre + "&vote_average.gte=" + $routeParams.rating + "&api_key=" + tmdbapikey + "&page=" + (++page))
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
                        $scope.$apply();
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
                $scope.$apply();
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
                $scope.$apply();
            }
        });
    }else if($routeParams.list == 'search'){
        $('.notification').first().text('Loading ...').show('fast');
         $http.get("http://api.themoviedb.org/3/search/movie?query=" + $routeParams.id + "&api_key=" + tmdbapikey + "&page=" + (++page))
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
                $scope.$apply();
            }
        });
    }else if($routeParams.list == 'discover'){
        $('.notification').first().text('Loading ...').show('fast');
         $http.get("http://api.themoviedb.org/3/discover/movie?sort_by=" + $routeParams.id + "&with_genres=" + $routeParams.genre + "&vote_average.gte=" + $routeParams.rating + "&api_key=" + tmdbapikey + "&page=" + (++page))
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
                $scope.$apply();
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