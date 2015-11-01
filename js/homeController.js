var app = angular.module('tlj');

app.controller('homeController', function($scope, $http){
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
    
    Parse.Cloud.run('getMovie', {className: 'MovieWatched', limit: 12, page: 1}, {
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
                $scope.MovieWatched.push(moviesTemp[i]);
                $scope.$apply();
            }
        },
        error: function(error) {
        }
    });
    Parse.Cloud.run('getMovie', {className: 'MovieWatchList', limit: 12, page: 1}, {
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
                $scope.MovieWatchList.push(moviesTemp[i]);
                $scope.$apply();
            }
        },
        error: function(error) {
        }
    });
    Parse.Cloud.run('getMovie', {className: 'MovieLiked', limit: 12, page: 1}, {
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
                $scope.MovieLiked.push(moviesTemp[i]);
                $scope.$apply();
            }
        },
        error: function(error) {
        }
    });
    
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
    
    $scope.updateStatus = function(){
        var status = $scope.statusText;
        var tagArray= status.match(/(^|\s)#([^ ]*)/g);
        var atArray= status.match(/(^|\s)@([^ ]*)/g);
        console.log(tagArray + ', ' + atArray);
    }
    
    $scope.fillAutoComplete = function(){
        var status = $scope.statusText;
        $http.get("http://api.themoviedb.org/3/search/movie?search_type=ngram&query=" + status + "&api_key=" + tmdbapikey)
            .success(function(response) {
            console.log(response);
            var movies = response.results;
            var dataList = "";
            movies.forEach(function(object){
                dataList += "<option value='" + object.title + " - " +object.release_date + "'>"
            });
            $('#moviesAutocomplete').html(dataList);
        });
    }
});