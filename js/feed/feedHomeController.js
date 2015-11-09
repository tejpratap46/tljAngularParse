var app = angular.module('tlj');

app.controller('feedHomeController', function($scope, $window, $routeParams, $http){
    var currentUser = Parse.User.current();
    var following;
    var username;
    if (currentUser) {
        username = currentUser.get('username');
        following = currentUser.get('following');
        $scope.username = currentUser.get('username');
        currentUser.fetch({
            success: function(user){
                following = user.get('following');
                console.log(following);
                currentUser = user;
                $scope.loadComments = loadComments();
            }
        });
    }else{
        window.location.hash = '#/login';
    }
    $scope.comments = [];
    var page = 0;

    angular.element($window).bind("scroll", function() {
        var windowHeight = "innerHeight" in window ? window.innerHeight : document.documentElement.offsetHeight;
        var body = document.body, html = document.documentElement;
        var docHeight = Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight,  html.scrollHeight, html.offsetHeight);
        windowBottom = windowHeight + window.pageYOffset;
        if (windowBottom >= docHeight - 100) {
            $scope.loadComments = loadComments();
        }
    });
    function loadComments(){
        following = currentUser.get('following');
        var comment = Parse.Object.extend("Comment");
        var query = new Parse.Query(comment);
        query.descending("votes");
        query.descending("createdAt");
        query.limit(10);
        if (following) {
            if (following.length > 0) {
                following.push(username);
                query.containedIn("username",following);
            }
        }
        query.skip(10 * (++page) - 10);
        $('.notification').first().text('Loading ...').show('fast');
        query.find({
        success: function(results) {
            $('.notification').first().hide('fast');
            var commentsTemp = [];
            results.forEach(function(object){
                var votedByTemp = object.get('voted_by');
                var user = Parse.User.current();
                var votedBy = "";
                if (votedByTemp.length == 0){
                    votedBy = "";
                }else if (votedByTemp.indexOf(user.get("username")) >= 0){
                    if (votedByTemp.length == 1)
                        votedBy = "you liked this";
                    else
                        votedBy = "you and " + (votedByTemp.length - 1) + " other liked this";
                }else{
                    votedBy = votedByTemp.length + " people liked this";
                }
                var updatedAtString = "";
                var updatedAt = object.get('updatedAt');
                var currentDate = new Date();
                var timeDifference = currentDate.getTime() - updatedAt.getTime();
                if(timeDifference > 86400000){
                    var days = Math.round(timeDifference/86400000);
                    updatedAtString = days + " day" + (days<2?'':'s') + " ago";
                }else{
                    updatedAtString = "Today at " + (updatedAt.getHours()%12 || 12) + ":" +((updatedAt.getMinutes()<10?'0':'') + updatedAt.getMinutes()) + " " + (updatedAt.getHours()<12?'AM':'PM');
                }
                commentsTemp.push({
                    id: object.id,
                    text: object.get('text'),
                    username: object.get('username'),
                    voted_by: votedBy,
                    votes: object.get('votes'),
                    title: object.get('title'),
                    poster_path: object.get('poster_path'),
                    vote_average: object.get('vote_average'),
                    release_date: object.get('release_date'),
                    tmdb_id: object.get('tmdb_id'),
                    updatedAt: updatedAtString
                });
            });

            for(var i=0;i<commentsTemp.length;i++){
                var index = $.inArray(commentsTemp[i]['title'], userMoviesWatchlistNames);
                if (index >= 0){
                    commentsTemp[i].watchlistClass = "btn-danger";
                }else{
                    commentsTemp[i].watchlistClass = "btn-success";
                }
                index = $.inArray(commentsTemp[i]['title'], userMoviesWatchedNames);
                if (index >= 0){
                    commentsTemp[i].watchedClass = "btn-danger";
                }else{
                    commentsTemp[i].watchedClass = "btn-info";
                }
                index = $.inArray(commentsTemp[i]['title'], userMoviesLikedNames);
                if (index >= 0){
                    commentsTemp[i].likedClass = "btn-danger";
                }else{
                    commentsTemp[i].likedClass = "btn-warning";
                }
                $scope.comments.push(commentsTemp[i]);
                $scope.$apply();
            }
        },
        error: function(error) {
            $('.notification').first().text('Error ' + error.message).show('fast').delay(3000).hide('fast');}
        });
    }

    $scope.upvote = function(id){
        var Comment = Parse.Object.extend("Comment");
        var query = new Parse.Query(Comment);
        query.get(id, {
            success: function(comment) {
            var user = Parse.User.current();
            if (user == null){
                eModal.confirm("Create a account in just 10 sec, and track all your entertainment life.", "Login").then(loginOk, loginCancel);
                return false;
            }else{
                // no problem, add comment
                var name = user.get("username");
                comment.addUnique("voted_by", name);
                comment.increment("votes");
                comment.save(null, {
                    success: function(comment) {
                        $scope.loadComments = loadComments();
                    },
                error: function(comment, error) {
                    }
                });
            }
        },
        error: function(error) {
        }
        });
    }
    
    $scope.watchlist = function($index,movie){
        addMovieWatchlist($index,movie.tmdb_id,movie.title,movie.poster_path,movie.genre_ids,movie.release_date,movie.vote_average);
    }
    
    $scope.watched = function($index,movie){
        addMovieWatched($index,movie.tmdb_id,movie.title,movie.poster_path,movie.genre_ids,movie.release_date,movie.vote_average);
    }
    
    $scope.trailer = function($index,movie){
        showMovieTrailer($index,movie.tmdb_id);
    }
    
    $scope.like = function($index,movie){
        addMovieLiked($index,movie.tmdb_id,movie.title,movie.poster_path,movie.genre_ids,movie.release_date,movie.vote_average);
    }

    $scope.updateStatus = function(){
        var statusText = $scope.statusText;
        var atArray= statusText.match(/(^|\s)@([^ ]*)/g);
        if(atArray != null){
            $('.notification').first().text('Adding...').show('fast');
            var query = atArray[0].replace("@", "").replace(/([A-Z0-9])/g, function($1){return " "+$1.toLowerCase();})
            $http.get("http://api.themoviedb.org/3/search/movie?search_type=ngram&query=" + query + "&api_key=" + tmdbapikey)
                .success(function(response) {
                var movies = response.results;
                if(movies.length == 0){
                    $('.notification').first().text('No Movie Found').show('fast').delay(3000).hide('fast');
                }
                var movie =  movies[0];
                var Status = Parse.Object.extend("Comment");
                var status = new Status();
                status.set("tmdb_id", movie.id + "");
                status.set("text", statusText);
                status.set("poster_path", movie.poster_path);
                status.set("title", movie.title);
                status.set("genre", movie.genre_ids);
                status.set("release_date", movie.release_date);
                status.set("vote_average", movie.vote_average);
                status.set("votes",1);
                var user = Parse.User.current();
                if (user == null){
                    eModal.confirm("Create a account in just 10 sec, and track all your entertainment life.", "Login").then(loginOk, loginCancel);
                    return false;
                }
                // no problem, add status
                var name = user.get("username");
                status.set("username", name);
                status.addUnique("voted_by", name);
                status.save(null, {
                    success: function(status) {
                        $('.notification').first().hide('fast');
                        $('#statusText').val('');
                        $scope.loadComments = loadComments();
                        addMovieWatchedSilent(-1,movie.id,movie.title,movie.poster_path,movie.genre_ids,movie.release_date,movie.vote_average);
                    },
                error: function(status, error) {
                        $('.notification').first().text('Oops! ' + error.message).show('fast').delay(3000).hide('fast');
                    }
                });
            });
        }
    }
    
    $scope.fillAutoComplete = function(){
        var status = $scope.statusText;
        var atArray = status.match(/(^|\s)@([^ ]*)/g);
        if(atArray != null){
            var query = atArray[0].replace("@", "").replace(/([A-Z])/g, function($1){return " "+$1.toLowerCase();});
            $http.get("http://api.themoviedb.org/3/search/movie?search_type=ngram&query=" + query + "&api_key=" + tmdbapikey)
                .success(function(response) {
                var movies = response.results;
                var dataList = [];
                movies.forEach(function(object){
                    dataList.push(object.title.split(' ').join(''));
                });
                $('#statusText').atwho({
                    at: "@",
                    data: dataList
                })
            });
        }
    }
});