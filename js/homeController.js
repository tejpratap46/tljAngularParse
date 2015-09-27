var app = angular.module('tlj');

app.controller('homeController', ['$scope', function($scope){
	setNav('#navHome');
    var currentUser = Parse.User.current();
    if (currentUser) {
        getUserMoviesWatchlist();
        getUserMoviesWatched();
        getUserMoviesLiked();
    }
}]);