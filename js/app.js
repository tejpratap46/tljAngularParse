var app = angular.module('tlj', [
   'ngRoute'
]);

app.config(function ($routeProvider) {
	$routeProvider
	.when('/', {
		templateUrl: 'views/home.html',
		controller: 'homeController'
	})
	.when('/login', {
		templateUrl: 'views/login.html'
	})
	.when('/logout', {
		templateUrl: 'views/login.html'
	})
	.when('/movie', {
		templateUrl: 'views/movie/home.html',
		controller : 'movieHomeController'
	})
	.when('/movie/list/:list/:id', {
		templateUrl: 'views/movie/list.html',
		controller : 'movieListController'
	})
	.when('/movie/view/:id/:name', {
		templateUrl: 'views/movie/view.html',
		controller : 'movieViewController'
	})
	.when('/test', {
		templateUrl: 'views/test.html'
	})
	.otherwise({
		redirectTo: '/'
	});
});

Parse.initialize("LQ0CkEovQS7YW2s4i6VXe7x6su7mrtGVFgJvMlYL", "ZEu9KSnsmCeQDqadynUC53dlU3Fs8MQSwI2mBY6R");

app.controller('navController', function ($scope) {
	checkIfLoggedIn();
});

app.controller('loginController', function($scope) {
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
			$('.notification').text('Error : ' + error.message).show('fast').delay(3000).hide('fast');
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

app.controller('MyFormController', ['$scope', function(scope) {
   scope.add = function() {
     alert(scope.field);
   };
}]);
