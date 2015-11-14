var app = angular.module('tlj');

app.registerCtrl('loginController', function($scope) {
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
	    },
		error: function(user, error) {
			$('.notification').text('Error : ' + error).show('fast').delay(3000).hide('fast');
		}
	});
   };

   $scope.register = function() {
   	$('.notification').text('Loading...').show('fast');
   	var user = new Parse.User();
	user.set("username", $scope.email);
	user.set("password", $scope.password);
	user.set("email", $scope.email);

	user.signUp(null, {
	  success: function(user) {
		$('.notification').hide('fast');
	    window.location.hash = '#/';
    	// update nav bar
    	checkIfLoggedIn();
	  },
	  error: function(user, error) {
	    $('.notification').text('Error : ' + error.message).show('fast').delay(3000).hide('fast');
	  }
	});
   };
});