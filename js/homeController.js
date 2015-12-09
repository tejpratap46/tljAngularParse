var app = angular.module('tlj');

app.registerCtrl('homeController', ['$scope', '$http', function($scope, $http){
	setNav('#navHome');
    var currentUser = Parse.User.current();
    if (currentUser) {
        getUserMoviesWatchlist();
        getUserMoviesWatched();
        getUserMoviesLiked();
    }
    
    $scope.MovieWatched = [];
    $scope.MovieLiked = [];
    $scope.MovieWatchList = [];

    $http.get("http://api.themoviedb.org/3/movie/popular?api_key=" + tmdbapikey + "&page=1")
        .success(function(response) {
            $scope.moviesPopular = response.results;
    });

    $scope.movies = [];
    $scope.listid = 'JcyK0VvLGe';
    $scope.loadMovies = loadMovies();

    function loadMovies(){
        Parse.Cloud.run('getListMovies', {list_id: $scope.listid, limit: 24, page: (1)}, {
            success: function(results) {
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

                for(var i=0;i<Math.min(6, moviesTemp.length);i++){
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
                $('.notification').first().hide('fast');
                // $('.notification').first().text('Error : ' + error.message).show('fast').delay(3000).hide('fast');
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
}]);