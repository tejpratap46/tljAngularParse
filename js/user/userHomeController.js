app = angular.module('tlj');

app.controller('userHomeController', function($scope, $routeParams){
    var currentUser = Parse.User.current();
    if (currentUser) {
    }else{
        window.location.hash = '#/';
    }
});