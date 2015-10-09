var app = angular.module('tlj');

app.controller('movieHomeController', function($scope, $http){
	setNav('#navStart');

	$scope.categories = [{"name" : "Top Rated", "id": "top_rated", "glyphicon": "stats"},
                         {"name" : "Popular", "id":"popular", "glyphicon": "heart"},
                         {"name" : "Up Coming" ,"id":"upcoming", "glyphicon": "film"},
                         {"name" : "Now Playing", "id":"now_playing", "glyphicon": "play"}];
    
    $scope.discover = [{"name" : "Highest Revenue", "id":"revenue.desc", "glyphicon": "usd"},
                       {"name" : "Released Date", "id":"release_date.desc", "glyphicon": "calendar"},
                       {"name" : "Highest Rating", "id":"vote_average.desc", "glyphicon": "stats"}];

    $http.get("http://api.themoviedb.org/3/genre/movie/list?api_key=" + tmdbapikey)
        .success(function(response) {
            $scope.genres = response.genres;
    });
});