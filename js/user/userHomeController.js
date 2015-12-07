var app = angular.module('tlj');

app.registerCtrl('userHomeController', ['$scope', '$routeParams', '$http', function($scope, $routeParams, $http){
    var currentUser = Parse.User.current();
    if (currentUser == null) {
        window.location.hash = '#/login';
        return;
    }
    var following = currentUser.get('following');
    var username = currentUser.get('username');
    $scope.username = currentUser.get('name');
    $scope.userObjectId = currentUser.id;
    currentUser.fetch({
        success: function(user){
            following = user.get('following');
            following = typeof following !== 'undefined' ? following : [];
            currentUser = user;
            if ($scope.userObjectId == $routeParams.username) {
                $scope.followText = "Following " + following.length + " people";
                $scope.buttonTheme = "link disabled";
            }else{
                var index = $.inArray($routeParams.username, following);
                console.log(index);
                if (index >= 0){
                    $scope.followText = "Following";
                    $scope.buttonTheme = "danger";
                }else{
                    $scope.followText = "Follow";
                    $scope.buttonTheme = "success";
                }
            }
        }
    });
    $scope.total = 0;
    $routeParams.username = typeof $routeParams.username !== 'undefined' ? $routeParams.username : $scope.userObjectId;
    $scope.userObjectId = $routeParams.username;
    if ($routeParams.username.length > 0) {
        var User = Parse.User;
        var user = new User();
        user.id = $routeParams.username;
        user.fetch().then(function(fetchedUser){
            $scope.username = fetchedUser.get("name");
        }, function(error){
            console.log(error.message);
        });
    }else{

    }
    var classes = ["MovieWatchList", "MovieWatched", "MovieLiked"];
    classes.forEach(function(className){
        $('.notification').first().text('Loading...').show('fast');
        Parse.Cloud.run('getMovieCount', {className: className, userObjectId: $routeParams.username}, {
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
        $scope.genreList = [];
        genres.forEach(function(genreItem){
            $('.notification').first().text('Loading...').show('fast');
            Parse.Cloud.run('getMovieCount', {className: 'MovieWatched', userObjectId: $routeParams.username, genre: genreItem.id}, {
                success: function(count) {
                    var percentage = (count/$scope.MovieWatched)*100;
                    var theme = "success";
                    if (percentage > 0) {
                        if(percentage < 10){
                            theme = "danger";
                        }else if(percentage < 30){
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
                        $scope.genreList.sort(compare);
                        $scope.$apply();
                    }
                },
                error: function(error) {
                    $('.notification').first().text('Error ' + error.message).show('fast').delay(3000).hide('fast');
                }
            });
        });
    });

    $scope.followUser = function(){
        if ($scope.userObjectId == $routeParams.username) {
            return;
        }else{
            var index = $.inArray($routeParams.username, following);
            if (index >= 0){
                $scope.followText = "Follow";
                $scope.buttonTheme = "success";
                newFollowing = jQuery.grep(following, function(value) {
                    return value != $routeParams.username;
                });
                currentUser.set("following", newFollowing);
                currentUser.save(null, {
                success: function(comment) {
                    $scope.followText = "Follow";
                    $scope.buttonTheme = "success";
                    following = newFollowing;
                },
                error: function(comment, error) {
                        $('.notification').first().text('Oops! ' + error.message).show('fast').delay(3000).hide('fast');
                    }
                });
            }else{
                $scope.followText = "Following";
                $scope.buttonTheme = "danger";
                currentUser.addUnique("following", $routeParams.username);
                currentUser.save(null, {
                success: function(comment) {
                    $scope.followText = "Following";
                    $scope.buttonTheme = "danger";
                    following.push(username);
                },
                error: function(comment, error) {
                        $('.notification').first().text('Oops! ' + error.message).show('fast').delay(3000).hide('fast');
                    }
                });
            }
        }
    }
 
    function compare(a,b) {
        if (a.count > b.count)
            return -1;
        if (a.count < b.count)
            return 1;
        return 0;
    }
}]);