var app = angular.module('tlj');

app.registerCtrl('loginController', ['$scope', function($scope) {
	setNav('#navHome');
   Parse.User.logOut();
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
	        window.location.reload();
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