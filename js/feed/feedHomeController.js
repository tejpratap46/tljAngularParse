var app = angular.module('tlj');

app.registerCtrl('feedHomeController', ['$scope', '$window', '$routeParams', '$http', function($scope, $window, $routeParams, $http){
    var currentUser = Parse.User.current();
    var following = [];
    var username;
    if (currentUser) {
        $scope.isMovieSnapShown= false;
        username = currentUser.get('username');
        userObjectId = currentUser.id;
        following = currentUser.get('following');
        $scope.username = currentUser.get('username');
        currentUser.fetch({
            success: function(user){
                following = user.get('following');
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
        if (windowBottom >= docHeight - 10) {
            $scope.loadComments = loadComments();
        }
    });
    function loadComments(){
        following.push(userObjectId);
        $('.notification').first().text('Loading ...').show('fast');
        Parse.Cloud.run('feed', {following: following, limit: 12, page: (++page)},{
        success: function(results) {
            $('.notification').first().hide('fast');
            var commentsTemp = results;
            for(var i=0;i<commentsTemp.length;i++){
                var offset = new Date().getTimezoneOffset();
                commentsTemp[i].timeString = moment(commentsTemp[i].sortWith).fromNow();
                commentsTemp[i].timeTitle = moment(commentsTemp[i].sortWith).format('MMMM Do YYYY, h:mm a');
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

    $scope.upvote = function($index,id){
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
                        var votedByTemp = comment.get('voted_by');
                        var votedBy = "";
                        if (votedByTemp.length == 0){
                            votedBy = "";
                        }else if (votedByTemp.indexOf(user.get("username")) >= 0){
                            if (votedByTemp.length == 1)
                                votedBy = " you liked this";
                            else
                                votedBy = " you and " + (votedByTemp.length - 1) + " other liked this";
                        }else{
                            votedBy = votedByTemp.length + " people liked this";
                        }
                        var pre = $('.likedBy').eq($index).text();
                        $('.likedBy').eq($index).text(votedBy);
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
                    $('.notification').first().text('No Movie Found with ' + query + '.Try to use autocomplete box.').show('fast').delay(3000).hide('fast');
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
                status.set("created_by", user);
                status.set("username", name);
                status.addUnique("voted_by", name);
                status.save(null, {
                    success: function(status) {
                        $('.notification').first().hide('fast');
                        $('#statusText').val('');
                        var commentsTemp = {
                            id:status.id,
                            canLike: true,
                            postAction: " Commented On",
                            text:status.get('text'),
                            username:status.get('username'),
                            voted_by:"you liked this",
                            votes:status.get('votes'),
                            title:status.get('title'),
                            poster_path:status.get('poster_path'),
                            vote_average:status.get('vote_average'),
                            release_date:status.get('release_date'),
                            tmdb_id:status.get('tmdb_id'),
                            updatedAt:"just now"
                        };
                        var index = $.inArray(commentsTemp['title'], userMoviesWatchlistNames);
                        if (index >= 0){
                            commentsTemp.watchlistClass = "btn-danger";
                        }else{
                            commentsTemp.watchlistClass = "btn-success";
                        }
                        index = $.inArray(commentsTemp['title'], userMoviesWatchedNames);
                        if (index >= 0){
                            commentsTemp.watchedClass = "btn-danger";
                        }else{
                            commentsTemp.watchedClass = "btn-info";
                        }
                        index = $.inArray(commentsTemp['title'], userMoviesLikedNames);
                        if (index >= 0){
                            commentsTemp.likedClass = "btn-danger";
                        }else{
                            commentsTemp.likedClass = "btn-warning";
                        }
                        $scope.comments.unshift(commentsTemp);
                        $scope.isMovieSnapShown = false;
                        $scope.$apply();
                        // addMovieWatchedSilent(-1,movie.id,movie.title,movie.poster_path,movie.genre_ids,movie.release_date,movie.vote_average);
                    },
                error: function(status, error) {
                        $('.notification').first().text('Oops! ' + error.message).show('fast').delay(3000).hide('fast');
                    }
                });
            });
        }else{
            $('.notification').first().text('use @MovieName to specify what movie you are talking about.').show('fast').delay(5000).hide('fast');
        }
    }
    
    $scope.fillAutoComplete = function(){
        var status = $scope.statusText;
        var atArray = status.match(/(^|\s)@([^ ]*)/g);
        $scope.isMovieSnapShown = false;
        if(atArray != null){
            var query = atArray[0].replace("@", "").replace(/([A-Z])/g, function($1){return " "+$1.toLowerCase();});
            $http.get("http://api.themoviedb.org/3/search/movie?search_type=ngram&query=" + query + "&api_key=" + tmdbapikey)
                .success(function(response) {
                var movies = response.results;
                if(movies.length == 0){
                    $scope.isMovieSnapShown = false;
                    $scope.$apply();
                    return;
                }
                $scope.isMovieSnapShown = true;
                $scope.$apply();
                var movieTemp = movies[0];
                var index = $.inArray(movieTemp['title'], userMoviesWatchlistNames);
                if (index >= 0){
                    movieTemp.watchlistClass = "btn-danger";
                }else{
                    movieTemp.watchlistClass = "btn-success";
                }
                index = $.inArray(movieTemp['title'], userMoviesWatchedNames);
                if (index >= 0){
                    movieTemp.watchedClass = "btn-danger";
                }else{
                    movieTemp.watchedClass = "btn-info";
                }
                index = $.inArray(movieTemp['title'], userMoviesLikedNames);
                if (index >= 0){
                    movieTemp.likedClass = "btn-danger";
                }else{
                    movieTemp.likedClass = "btn-warning";
                }
                $scope.search = movieTemp;
                $scope.$apply();
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
}]);