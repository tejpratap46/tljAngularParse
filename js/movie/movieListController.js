var app = angular.module('tlj');

app.controller('movieListController', function($scope, $window, $http, $routeParams){
	setNav('#navMovie');
    var page = 1;
    angular.element($window).bind("scroll", function() {
        var windowHeight = "innerHeight" in window ? window.innerHeight : document.documentElement.offsetHeight;
        var body = document.body, html = document.documentElement;
        var docHeight = Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight,  html.scrollHeight, html.offsetHeight);
        windowBottom = windowHeight + window.pageYOffset;
        if (windowBottom >= docHeight) {
            if ($routeParams.list == 'list'){
                $http.get("http://api.themoviedb.org/3/movie/" + $routeParams.id + "?api_key=" + tmdbapikey + "&page=" + page)
                .success(function(response) {
                    page++;
                    for (var i=0; i<response.results.length; i++){
                        $scope.movies.push(response.results[i]);
                        $scope.$apply;
                    }
                });
            }else if($routeParams.list == 'genre'){
                $http.get("http://api.themoviedb.org/3/genre/" + $routeParams.id + "/movies?api_key=" + tmdbapikey + "&page=" + page)
                .success(function(response) {
                    page++;
                    for (var i=0; i<response.results.length; i++){
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
            $scope.movies = response.results;
        });
    }else if($routeParams.list == 'genre'){
         $http.get("http://api.themoviedb.org/3/genre/" + $routeParams.id + "/movies?api_key=" + tmdbapikey + "&page=" + page)
            .success(function(response) {
            page++;
            $scope.movies = response.results;
        });
    }
    
    $scope.watchlist = function($index,tmdbid,imdbid,name,image){
        addMovieWatchlist($index,tmdbid,"",name,image);
    }
    
    $scope.watched = function($index,tmdbid,imdbid,name,image){
        addMovieWatched($index,tmdbid,"",name,image);
    }
});