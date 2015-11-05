var app = angular.module('tlj', [
   'ngRoute'
]);

app.config(function ($routeProvider) {
    
    Parse.initialize("LQ0CkEovQS7YW2s4i6VXe7x6su7mrtGVFgJvMlYL", "ZEu9KSnsmCeQDqadynUC53dlU3Fs8MQSwI2mBY6R");
    var currentUser = Parse.User.current();
    if (currentUser) {
        getUserMoviesWatchlist();
        getUserMoviesWatched();
        getUserMoviesLiked();
    }
    
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
	.when('/movie/list/:list/:id/:genre?/:rating?/:cast?', {
		templateUrl: 'views/movie/list.html',
		controller : 'movieListController'
	})
	.when('/movie/view/:id/:name?', {
		templateUrl: 'views/movie/view.html',
		controller : 'movieViewController'
	})
	.when('/user', {
		templateUrl: 'views/user/home.html',
		controller : 'userHomeController'
	})
	.when('/trend/:id?/:genre?', {
		templateUrl: 'views/trend/list.html',
		controller : 'trendListController'
	})
	.when('/user/movie/:category/:genre?', {
		templateUrl: 'views/user/movie.html',
		controller : 'userMovieController'
	})
	.when('/people/view/:id/:name?', {
		templateUrl: 'views/people/view.html',
		controller : 'peopleViewController'
	})
	.when('/people/list/:id', {
		templateUrl: 'views/people/list.html',
		controller : 'peopleListController'
	})
	.when('/list', {
		templateUrl: 'views/list/home.html',
		controller : 'listHomeController'
	})
	.when('/list/view/:id', {
		templateUrl: 'views/list/view.html',
		controller : 'listViewController'
	})
	.when('/feed', {
		templateUrl: 'views/feed/home.html',
		controller : 'feedHomeController'
	})
	.when('/test', {
		templateUrl: 'views/test.html'
	})
	.otherwise({
		redirectTo: '/'
	});
});


app.controller('navController', function ($scope) {
	checkIfLoggedIn();
    $scope.searchMovie = function(){
        var movie = $scope.searchData;
        window.location.hash = "#/movie/list/search/" + movie;
    }
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

app.controller('MyFormController', ['$scope', function(scope) {
   scope.add = function() {
     alert(scope.field);
   };
}]);
