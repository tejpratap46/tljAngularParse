app = angular.module('tlj');

app.controller('movieImdbController', function($scope, $http){
    setNav('#navMovie');
    $http.get("http://ajax.googleapis.com/ajax/services/feed/load?v=2.0&q=http://feeds.s-anand.net/imdbtop250&num=250")
        .success(function(response) {
        $scope.movies = response.responseData.feed.entries;
    });
});