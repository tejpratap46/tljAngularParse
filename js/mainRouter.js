var app = angular.module('tlj');

app.registerCtrl('mainRouter', ['$scope', function($scope) {
	setNav('#navHome');
	console.log("mainRouter");
	var currentUser = Parse.User.current();
    if (currentUser) {
        window.location.hash = '#/feed';
    }else{
        window.location.hash = '#/';
    }
}]);