var app = angular.module('tlj');

app.registerCtrl('postHomeController', ['$scope', function($scope){
    document.title = 'View Post';
	setNav('#navHome');
}]);