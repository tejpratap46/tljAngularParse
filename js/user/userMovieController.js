app = angular.module('tlj');

app.registerCtrl('userMovieController', ['$scope', '$routeParams', '$window', function($scope, $routeParams, $window){
    
    var currentUser = Parse.User.current();
    if (currentUser) {
        $scope.username = currentUser.get('username');
    }else{
        window.location.hash = '#/';
    }
    
    $routeParams.genre = typeof $routeParams.genre !== 'undefined' ? $routeParams.genre : '';
    $routeParams.genre = parseInt($routeParams.genre);
    $routeParams.username = typeof $routeParams.username !== 'undefined' ? $routeParams.username : $scope.username;
    
    $scope.movies = [];
    var page = 0;
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
        Parse.Cloud.run('getMovie', {className: $routeParams.category, limit: 12, page: (++page), genre: $routeParams.genre, username: $routeParams.username},{
        success: function(results) {
            var moviesTemp = [];
            var groupBy;
            var shortBy;
            results.forEach(function(object){
                if ($routeParams.category == 'MovieWatchList') {
                    var now = moment();
                    var day = moment(object.get('release_date'));
                    var text = "";
                    if (now < day){
                        text = "Releasing ";
                    }else{
                        text = "Released ";
                    }
                    groupBy = text + moment(object.get('release_date')).fromNow();;
                    shortBy = object.get('release_date');
                }else if ($routeParams.category == 'MovieWatched'){
                    groupBy = "Watched " + moment(object.get('updatedAt')).fromNow();
                    shortBy = object.get('updatedAt');
                }else{
                    groupBy = "Liked " + moment(object.get('updatedAt')).fromNow();
                    shortBy = object.get('updatedAt');
                }
                moviesTemp.push({
                    title: object.get('title'),
                    poster_path: object.get('poster_path'),
                    vote_average: object.get('vote_average'),
                    release_date: object.get('release_date'),
                    genre_ids: object.get('genre'),
                    group_by: groupBy,
                    short_by: shortBy,
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
                $scope.movies.sort(compare);
                $scope.$apply();
            }
            $('.notification').first().hide('fast');
        },
        error: function(error) {
            $('.notification').first().text('Error ' + error.message).show('fast').delay(3000).hide('fast');}
        });
    }

    function compare(a,b) {
        if (a.short_by > b.short_by)
            return -1;
        if (a.short_by < b.short_by)
            return 1;
        return 0;
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
}]);