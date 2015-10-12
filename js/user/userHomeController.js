var app = angular.module('tlj');

app.controller('userHomeController', function($scope, $routeParams){
    var currentUser = Parse.User.current();
    if (currentUser) {
        $scope.username = currentUser.get('username');
    }else{
        window.location.hash = '#/';
    }
    $scope.total = 0;
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
                    $scope.total += count;
                }else if(className == "MovieWatched"){
                    $scope.MovieWatched = count;
                    $scope.level = Math.floor(Math.log2(count));
                    $scope.remaining = Math.pow(2,$scope.level + 1) - count;
                    var levelMovies = Math.pow(2,$scope.level + 1) - Math.pow(2,$scope.level);
                    var moviesLevelWatched = count - Math.pow(2,$scope.level);
                    $scope.levelPercent = (moviesLevelWatched/levelMovies) * 100;
                    $scope.total += count;
                }else{
                    $scope.MovieLiked = count;
                    $scope.total += count;
                }
                $scope.$apply();
            },
            error: function(error) {
                $('.notification').first().text('Error ' + error.message).show('fast').delay(3000).hide('fast');
            }
        });
    });
});