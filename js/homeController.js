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
        var statusText = $scope.statusText;
        var atArray= statusText.match(/(^|\s)@([^ ]*)/g);
        if(atArray != null){
            $('.notification').first().text('Adding...').show('fast');
            var query = atArray[0].replace("@", "").replace(/([A-Z0-9])/g, function($1){return " "+$1.toLowerCase();})
            $http.get("http://api.themoviedb.org/3/search/movie?search_type=ngram&query=" + query + "&api_key=" + tmdbapikey)
                .success(function(response) {
                var movies = response.results;
                if(movies.length == 0){
                    $('.notification').first().text('No Movie Found').show('fast').delay(3000).hide('fast');
                }
                var movie =  movies[0];
                var tmdb_id = movie.id;
                var poster_path = movie.poster_path;
                var title = movie.title;
                var Status = Parse.Object.extend("Status");
                addMovieWatched(-1,movie.id,movie.title,movie.poster_path,movie.genre_ids,movie.release_date,movie.vote_average);
                var status = new Status();
                status.set("tmdb_id", tmdb_id + "");
                status.set("text", statusText);
                status.set("poster_path", poster_path);
                status.set("title", title);
                status.set("votes",1);
                var user = Parse.User.current();
                if (user == null){
                    eModal.confirm("Create a account in just 10 sec, and track all your entertainment life.", "Login").then(loginOk, loginCancel);
                    return false;
                }
                // no problem, add status
                var name = user.get("username");
                status.set("username", name);
                status.addUnique("voted_by", name);
                status.save(null, {
                    success: function(status) {
                        $('.notification').first().hide('fast');
                    },
                error: function(status, error) {
                        $('.notification').first().text('Oops! ' + error.message).show('fast').delay(3000).hide('fast');
                    }
                });
            });
        }
    }
    
    $scope.fillAutoComplete = function(){
        var status = $scope.statusText;
        var atArray = status.match(/(^|\s)@([^ ]*)/g);
        if(atArray != null){
            var query = atArray[0].replace("@", "").replace(/([A-Z])/g, function($1){return " "+$1.toLowerCase();});
            console.log(query);
            $http.get("http://api.themoviedb.org/3/search/movie?search_type=ngram&query=" + query + "&api_key=" + tmdbapikey)
                .success(function(response) {
                var movies = response.results;
                var dataList = [];
                movies.forEach(function(object){
                    dataList.push(object.title.split(' ').join(''));
                });
                $('#statusText').atwho({
                    at: "@",
                    data: dataList
                })
            });
        }
    }
});