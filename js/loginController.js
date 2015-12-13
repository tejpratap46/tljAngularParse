var app = angular.module('tlj');

app.registerCtrl('loginController', ['$scope', function($scope) {
	setNav('#navHome');
   Parse.User.logOut();
   var userMoviesWatchlistNames = [];
	var userMoviesWatchedNames = [];
	var userMoviesLikedNames = [];
	var userMoviesWatchlist = [];
	var userMoviesWatched = [];
	var userMoviesLiked = [];
   // update nav bar
   checkIfLoggedIn();
   $scope.login = function() {
   	$('.notification').text('Loading...').show('fast');
	Parse.User.logIn($scope.email, $scope.password, {
		success: function(user) {
			$('.notification').hide('fast');
	    	window.location.hash = '#/';
	    	// update nav bar
	    	checkIfLoggedIn();
	        getUserMoviesWatchlist();
	        getUserMoviesWatched();
	        getUserMoviesLiked();
	    },
		error: function(user, error) {
			$('.notification').text('Error : ' + error).show('fast').delay(3000).hide('fast');
		}
	});
	};

   $scope.register = function() {
   	window.location.hash = "/register"
   };
}]);