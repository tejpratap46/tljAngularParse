var app = angular.module('tlj');

app.controller('movieHomeController', function($scope, $http){
	setNav('#navMovie');

	$scope.categories = [{"name" : "Top Rated", "id": "top_rated", "glyphicon": "stats"},
                         {"name" : "Popular", "id":"popular", "glyphicon": "heart"},
                          {"name" : "Up Coming" ,"id":"upcoming", "glyphicon": "film"},
                          {"name" : "Now Playing", "id":"now_playing", "glyphicon": "play"},
                          {"name" : "IMDB Top 250", "id":"", "glyphicon": "signal"},
                          {"name" : "Highest Revenue", "id":"", "glyphicon": "usd"}];

    $http.get("http://api.themoviedb.org/3/genre/movie/list?api_key=" + tmdbapikey)
        .success(function(response) {
            $scope.genres = response.genres;
    });
});