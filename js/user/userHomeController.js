var app = angular.module('tlj');

app.controller('userHomeController', function($scope, $routeParams, $http){
    var currentUser = Parse.User.current();
    if (currentUser) {
        $scope.username = currentUser.get('username');
    }else{
        window.location.hash = '#/';
    }
    $scope.total = 0;
    $routeParams.username = typeof $routeParams.username !== 'undefined' ? $routeParams.username : $scope.username;
    if ($routeParams.username.length > 0) {
        $scope.username = $routeParams.username;
    }
    var classes = ["MovieWatchList", "MovieWatched", "MovieLiked"];
    classes.forEach(function(className){
        $('.notification').first().text('Loading...').show('fast');
        Parse.Cloud.run('getMovieCount', {className: className, username: $routeParams.username}, {
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
    
    $http.get("http://api.themoviedb.org/3/genre/movie/list?api_key=" + tmdbapikey)
        .success(function(response) {
        var genres = response.genres;
        var index = 1;
        $scope.genreList = [];
        genres.forEach(function(genreItem){
            $('.notification').first().text('Loading...').show('fast');
            Parse.Cloud.run('getMovieCount', {className: 'MovieWatched', username: $routeParams.username, genre: genreItem.id}, {
                success: function(count) {
                    var percentage = (count/$scope.MovieWatched)*100;
                    var theme = "success";
                    if(percentage < 10){
                        theme = "danger";
                    }else if(percentage < 40){
                        theme = "warning";
                    }else if(percentage < 70){
                        theme = "info";
                    }else{
                        theme = "success";
                    }
                    $scope.genreList.push({
                        id: genreItem.id,
                        name: genreItem.name,
                        theme: theme,
                        count: percentage
                    });
                    if(genres.length == index){
                        $('.notification').first().hide('fast');
                        $scope.genreList.sort(compare);
                        $scope.$apply();
                    }
                    index += 1;
                },
                error: function(error) {
                    $('.notification').first().text('Error ' + error.message).show('fast').delay(3000).hide('fast');
                }
            });
        });
    });
    
    function compare(a,b) {
        if (a.count > b.count)
            return -1;
        if (a.count < b.count)
            return 1;
        return 0;
    }
});