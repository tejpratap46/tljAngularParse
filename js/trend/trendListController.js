var app = angular.module('tlj');

app.controller('trendListController', function($scope, $routeParams){
	setNav('#navHome');
    $routeParams.id = typeof $routeParams.id !== 'undefined' ? $routeParams.id : 'MovieWatched';
    Parse.Cloud.run('getMovie', {className: $routeParams.id, limit: 24, page: 1}, {
        success: function(results) {
            var moviesTemp = [];
            $scope.movies = [];
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
                $scope.movies.push(moviesTemp[i]);
                $scope.$apply();
            }
        },
        error: function(error) {
        }
    });
});