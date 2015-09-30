var app = angular.module('tlj');

app.controller('peopleViewController', function($scope, $http, $routeParams){
    setNav('#navMovie');
    $http.get("http://api.themoviedb.org/3/person/" + $routeParams.id + "?api_key=" + tmdbapikey)
        .success(function(response) {
            $scope.people = response;
    });
    $http.get("http://api.themoviedb.org/3/person/" + $routeParams.id + "/movie_credits?api_key=" + tmdbapikey)
        .success(function(response) {
            $scope.movies = response.cast;
    });
});