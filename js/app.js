var app = angular.module('tlj', [
   'ngRoute'
]);

app.config(['$routeProvider', '$controllerProvider', function($routeProvider, $controllerProvider){
    
    Parse.initialize("LQ0CkEovQS7YW2s4i6VXe7x6su7mrtGVFgJvMlYL", "ZEu9KSnsmCeQDqadynUC53dlU3Fs8MQSwI2mBY6R");
    var currentUser = Parse.User.current();
    var homeTemplate = "views/home.html";
    var homeController = "homeController";
    var homeControllerjs = "js/homeController.js";
    if (currentUser) {
        getUserMoviesWatchlist();
        getUserMoviesWatched();
        getUserMoviesLiked();
        homeTemplate = "views/feed/home.html";
        homeController = "feedHomeController";
        homeControllerjs = "js/feed/feedHomeController.js";
    }

// code used from : http://stackoverflow.com/questions/25168593/angularjs-lazy-loading-controllers-and-content/28199498#28199498
    app.registerCtrl = $controllerProvider.register;

	function loadScript(path) {
	  var result = $.Deferred(),
	  script = document.createElement("script");
	  script.async = "async";
	  script.type = "text/javascript";
	  script.src = path;
	  script.onload = script.onreadystatechange = function (_, isAbort) {
	      if (!script.readyState || /loaded|complete/.test(script.readyState)) {
	         if (isAbort)
	             result.reject();
	         else
	            result.resolve();
	    }
	  };
	  script.onerror = function () { result.reject(); };
	  document.querySelector("head").appendChild(script);
	  return result.promise();
	}

	function loader(arrayPath){
	    return {
	      load: function($q){
                var deferred = $q.defer(),
                map = arrayPath.map(function(path) {
                    return loadScript(path);
                });

                $q.all(map).then(function(r){
                    deferred.resolve();
                });
                return deferred.promise;
	        }
	    };
	}
    
	$routeProvider
	.when('/', {
		templateUrl: 'views/mainRouter.html',
		controller: 'mainRouter',
        resolve: loader(['js/mainRouter.js'])
	})
	.when('/login', {
		templateUrl: 'views/login.html',
		controller : 'loginController',
        resolve: loader(['js/loginController.js'])
	})
	.when('/register', {
		templateUrl: 'views/register.html',
		controller : 'registerController',
        resolve: loader(['js/registerController.js'])
	})
	.when('/logout', {
		templateUrl: 'views/login.html',
		controller : 'loginController',
        resolve: loader(['js/loginController.js'])
	})
	.when('/movie', {
		templateUrl: 'views/movie/home.html',
		controller : 'movieHomeController',
        resolve: loader(['js/movie/movieHomeController.js'])
	})
	.when('/movie/list/:list/:id/:genre?/:rating?/:cast?', {
		templateUrl: 'views/movie/list.html',
		controller : 'movieListController',
        resolve: loader(['js/movie/movieListController.js'])
	})
	.when('/movie/view/:id/:name?', {
		templateUrl: 'views/movie/view.html',
		controller : 'movieViewController',
        resolve: loader(['js/movie/movieViewController.js'])
	})
	.when('/user/:username?', {
		templateUrl: 'views/user/home.html',
		controller : 'userHomeController',
        resolve: loader(['js/user/userHomeController.js'])
	})
	.when('/user/movie/:category/:genre?/:username?', {
		templateUrl: 'views/user/movie.html',
		controller : 'userMovieController',
        resolve: loader(['js/user/userMovieController.js'])
	})
	.when('/trend/:id?/:genre?', {
		templateUrl: 'views/trend/list.html',
		controller : 'trendListController',
        resolve: loader(['js/trend/trendListController.js'])
	})
	.when('/people/view/:id/:name?', {
		templateUrl: 'views/people/view.html',
		controller : 'peopleViewController',
        resolve: loader(['js/people/peopleViewController.js'])
	})
	.when('/people/list/:id', {
		templateUrl: 'views/people/list.html',
		controller : 'peopleListController',
        resolve: loader(['js/people/peopleListController.js'])
	})
	.when('/list', {
		templateUrl: 'views/list/home.html',
		controller : 'listHomeController',
        resolve: loader(['js/list/listHomeController.js'])
	})
	.when('/list/view/:id', {
		templateUrl: 'views/list/view.html',
		controller : 'listViewController',
        resolve: loader(['js/list/listViewController.js'])
	})
	.when('/feed', {
		templateUrl: 'views/feed/home.html',
		controller : 'feedHomeController',
        resolve: loader(['js/feed/feedHomeController.js'])
	})
	.when('/follow', {
		templateUrl: 'views/follow/home.html',
		controller : 'followHomeController',
        resolve: loader(['js/follow/followHomeController.js'])
	})
	.when('/test', {
		templateUrl: 'views/test.html'
	})
	.otherwise({
		redirectTo: '/'
	});
}]);

app.controller('navController', function ($scope) {
	checkIfLoggedIn();
    $scope.searchMovie = function(){
        var movie = $scope.searchData;
        window.location.hash = "#/movie/list/search/" + movie;
    }
});