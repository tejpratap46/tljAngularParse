var app = angular.module('tlj');

app.controller('movieListController', function($scope, $window, $http, $routeParams){
	setNav('#navMovie');
    
    var page = 1;
    angular.element($window).bind("scroll", function() {
        var windowHeight = "innerHeight" in window ? window.innerHeight : document.documentElement.offsetHeight;
        var body = document.body, html = document.documentElement;
        var docHeight = Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight,  html.scrollHeight, html.offsetHeight);
        windowBottom = windowHeight + window.pageYOffset;
        if (windowBottom >= docHeight - 10) {
            if ($routeParams.list == 'list'){
                $http.get("http://api.themoviedb.org/3/movie/" + $routeParams.id + "?api_key=" + tmdbapikey + "&page=" + page)
                .success(function(response) {
                    page++;
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
            }else if($routeParams.list == 'genre'){
                $http.get("http://api.themoviedb.org/3/genre/" + $routeParams.id + "/movies?api_key=" + tmdbapikey + "&page=" + page)
                .success(function(response) {
                    page++;
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
            }else if($routeParams.list == 'genre'){
                $http.get("http://api.themoviedb.org/3/search/movie?query=" + $routeParams.id + "/&api_key=" + tmdbapikey + "&page=" + page)
                .success(function(response) {
                    page++;
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
            }
        }
    });
    
    if ($routeParams.list == 'list'){
        $http.get("http://api.themoviedb.org/3/movie/" + $routeParams.id + "?api_key=" + tmdbapikey + "&page=" + page)
            .success(function(response) {
            page++;
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
    }else if($routeParams.list == 'genre'){
         $http.get("http://api.themoviedb.org/3/genre/" + $routeParams.id + "/movies?api_key=" + tmdbapikey + "&page=" + page)
            .success(function(response) {
            page++;
            
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
    }else if($routeParams.list == 'search'){
         $http.get("http://api.themoviedb.org/3/search/movie?query=" + $routeParams.id + "/&api_key=" + tmdbapikey + "&page=" + page)
            .success(function(response) {
            page++;
            
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
    }
    
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