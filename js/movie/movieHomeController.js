var app = angular.module('tlj');

app.controller('movieHomeController', function($scope, $http){
	setNav('#navMovie');

	$scope.categories = [{"name" : "Top Rated", "id": "top_rated"},
                         {"name" : "Popular", "id":"popular"},
                          {"name" : "Up Coming" ,"id":"upcoming"},
                          {"name" : "Now Playing", "id":"now_playing"},
                          {"name" : "IMDB Top 250", "id":""},
                          {"name" : "Highest Revenue", "id":""}];

    $http.get("http://api.themoviedb.org/3/genre/movie/list?api_key=" + tmdbapikey)
        .success(function(response) {
            $scope.genres = response.genres;
    });
});