var app = angular.module('tlj');

app.registerCtrl('registerController', ['$scope', function($scope) {
	setNav('#navHome');
   Parse.User.logOut();
   // update nav bar
   checkIfLoggedIn();
   $scope.login = function() {
   		window.location.hash = "#/login"
	};

	$scope.isError = false;

   $scope.register = function() {
   	$('.notification').text('Loading...').show('fast');
   	var user = new Parse.User();
	user.set("username", $scope.email);
	user.set("name", $scope.name);
	user.addUnique("following", "");
	user.set("password", $scope.password);
	user.set("email", $scope.email);

	user.signUp(null, {
	  success: function(user) {
		$('.notification').hide('fast');
	    window.location.hash = '#/';
    	// update nav bar
    	checkIfLoggedIn();
      window.location.reload();
	  },
	  error: function(user, error) {
		$('.notification').hide('fast');
	  	$scope.isError = true;
	  	$scope.errorMessage = error.message;
	  }
	});
   };

   $scope.checkUsername = function(){
   	console.log($scope.name);
   	var queryUser = new Parse.Query(Parse.User);
   	queryUser.equalTo('username', $scope.name);
   	queryUser.count({
        success: function(count) {
   		console.log(count);
            if (count > 0) {
            	$scope.usernameErrorTheme = "has-error";
            	$scope.usernameError = "username already taken";
            }else{
            	$scope.usernameErrorTheme = "";
            	$scope.usernameError = "";
            }
        },
        error: function(error) {
   			console.log(error);
        }
    });
   };
}]);