var app = angular.module('tlj');

app.controller('userHomeController', function($scope, $routeParams){
    var currentUser = Parse.User.current();
    if (currentUser) {
    }else{
        window.location.hash = '#/';
    }
    
    var classes = ["MovieWatchList", "MovieWatched", "MovieLiked"];
    classes.forEach(function(className){
        var movie = Parse.Object.extend(className);
        var query = new Parse.Query(movie);
        query.equalTo("is_deleted", false);
        $('.notification').first().text('Loading...').show('fast');
        query.count({
            success: function(count) {
                $('.notification').first().hide('fast');
                if(className == "MovieWatchList"){
                    $scope.MovieWatchList = count;
                }else if(className == "MovieWatched"){
                    $scope.MovieWatched = count;
                }else{
                    $scope.MovieLiked = count;
                }
                $scope.$apply();
            },
            error: function(error) {
                $('.notification').first().text('Error ' + error.message).show('fast').delay(3000).hide('fast');
            }
        });
    });
});