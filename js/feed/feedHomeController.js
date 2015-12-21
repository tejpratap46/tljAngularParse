var app = angular.module('tlj');

app.registerCtrl('feedHomeController', ['$scope', '$window', '$routeParams', '$http', function($scope, $window, $routeParams, $http){
    document.title = 'The List Job';
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
        if (windowBottom >= docHeight - 100) {
            $scope.loadComments = loadComments();
        }
    });
    function loadComments(){
        following.push(userObjectId);
        $('.notification').first().text('Loading ...').show('fast');
        Parse.Cloud.run('feed', {following: following, limit: 6, page: (++page)},{
        success: function(results) {
            $('.notification').first().hide('fast');
            var commentsTemp = results;
            for(var i=0;i<commentsTemp.length;i++){
                commentsTemp[i].isAd = commentsTemp[i].isAd ? true : false;
                commentsTemp[i].isList = commentsTemp[i].list_url ? true : false;
                commentsTemp[i].isVideo = commentsTemp[i].video_id ? true : false;
                if (commentsTemp[i].canLike) {
                    if (commentsTemp[i].voted_by.indexOf("you ") >= 0){
                        commentsTemp[i].commentLikedClass = "primary";
                    }else{
                        commentsTemp[i].commentLikedClass = "link";
                    }
                }
                var offset = new Date().getTimezoneOffset();
                if (commentsTemp[i].isList) {
                    commentsTemp[i].timeString = moment(commentsTemp[i].release_date).fromNow();
                    commentsTemp[i].timeTitle = moment(commentsTemp[i].release_date).format('MMMM Do YYYY, h:mm a');
                }else{
                    commentsTemp[i].timeString = moment(commentsTemp[i].sortWith).fromNow();
                    commentsTemp[i].timeTitle = moment(commentsTemp[i].sortWith).format('MMMM Do YYYY, h:mm a');
                }
                var index = $.inArray(commentsTemp[i].tmdb_id, userMoviesWatchlistNames);
                if (index >= 0){
                    commentsTemp[i].watchlistClass = "btn-danger";
                }else{
                    commentsTemp[i].watchlistClass = "btn-success";
                }
                index = $.inArray(commentsTemp[i].tmdb_id, userMoviesWatchedNames);
                if (index >= 0){
                    commentsTemp[i].watchedClass = "btn-danger";
                }else{
                    commentsTemp[i].watchedClass = "btn-info";
                }
                index = $.inArray(commentsTemp[i].tmdb_id, userMoviesLikedNames);
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
            $('.notification').first().hide('fast');
            // $('.notification').first().text('Error ' + error.message).show('fast').delay(3000).hide('fast');
        }
    });
    }

    $scope.upvote = function($index,id){
        var user = Parse.User.current();
        if (user == null){
            eModal.confirm("Create a account in just 10 sec, and track all your entertainment life.", "Login").then(loginOk, loginCancel);
            return false;
        }
        var Comment = Parse.Object.extend("Comment");
        var query = new Parse.Query(Comment);
        $('.notification').first().text('Loading...').show('fast');
        query.get(id, {
            success: function(comment) {
            $('.notification').first().hide('fast');
            if (comment.get('voted_by')) {
                if (comment.get('voted_by').indexOf(user.id) >= 0){
                    // Remove like
                    $scope.comments[$index].commentLikedClass = "link";
                    comment.remove("voted_by", user.id);
                    comment.set(comment.get("votes")-1);
                }else{
                    // Add like
                    $scope.comments[$index].commentLikedClass = "primary";
                    comment.addUnique("voted_by", user.id);
                    comment.increment("votes");
                }
            }else{
                $scope.comments[$index].commentLikedClass = "primary";
                comment.addUnique("voted_by", user.id);
                comment.increment("votes");
            }
            $scope.$apply();
            comment.save(null, {
                success: function(comment) {
                    var votedByTemp = comment.get('voted_by');
                    var votedBy = "";
                    if (votedByTemp.length == 0){
                        votedBy = "";
                    }else if (votedByTemp.indexOf(user.id) >= 0){
                        if (votedByTemp.length == 1){
                            votedBy = " you liked this";
                        }else{
                            votedBy = " you and " + (votedByTemp.length - 1) + " other liked this";
                        }
                    }else{
                        votedBy = votedByTemp.length + " people liked this";
                    }
                    $scope.comments[$index].voted_by = votedBy;
                    $scope.$apply();
                },
                error: function(comment, error) {
                }
            });
        },
        error: function(error) {
        }
        });
    }
    
    $scope.watchlist = function($index,movie){
        var add = $scope.isMovieSnapShown ? 1:0;
        addMovieWatchlist($index + add,movie.tmdb_id,movie.title,movie.poster_path,movie.genre_ids,movie.release_date,movie.vote_average);
    }
    
    $scope.watched = function($index,movie){
        var add = $scope.isMovieSnapShown ? 1:0;
        addMovieWatched($index + add,movie.tmdb_id,movie.title,movie.poster_path,movie.genre_ids,movie.release_date,movie.vote_average);
    }
    
    $scope.trailer = function($index,movie){
        if (movie.isVideo) {
            eModal.iframe('http://www.youtube.com/embed/' + movie.video_id + '?autoplay=1', 'Trailer');
        }else{
            var add = $scope.isMovieSnapShown ? 1:0;
            showMovieTrailer($index + add,movie.tmdb_id);
        }
    }
    
    $scope.like = function($index,movie){
        var add = $scope.isMovieSnapShown ? 1:0;
        addMovieLiked($index + add,movie.tmdb_id,movie.title,movie.poster_path,movie.genre_ids,movie.release_date,movie.vote_average);
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
                        var index = $.inArray(commentsTemp.tmdb_id, userMoviesWatchlistNames);
                        if (index >= 0){
                            commentsTemp.watchlistClass = "btn-danger";
                        }else{
                            commentsTemp.watchlistClass = "btn-success";
                        }
                        index = $.inArray(commentsTemp.tmdb_id, userMoviesWatchedNames);
                        if (index >= 0){
                            commentsTemp.watchedClass = "btn-danger";
                        }else{
                            commentsTemp.watchedClass = "btn-info";
                        }
                        index = $.inArray(commentsTemp.tmdb_id, userMoviesLikedNames);
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
                var index = $.inArray(movieTemp.tmdb_id, userMoviesWatchlistNames);
                movieTemp.tmdb_id = movieTemp.id;
                if (index >= 0){
                    movieTemp.watchlistClass = "btn-danger";
                }else{
                    movieTemp.watchlistClass = "btn-success";
                }
                index = $.inArray(movieTemp.tmdb_id, userMoviesWatchedNames);
                if (index >= 0){
                    movieTemp.watchedClass = "btn-danger";
                }else{
                    movieTemp.watchedClass = "btn-info";
                }
                index = $.inArray(movieTemp.tmdb_id, userMoviesLikedNames);
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

    $scope.writeComment = function(comment){
        var currentUser = Parse.User.current();
        var Comment = Parse.Object.extend("Comment");
        var parentComment = new Comment();
        parentComment.id = comment.id;
        var subComment = new Comment();
        subComment.set("parent_comment", parentComment);
        subComment.set("created_by", currentUser);
        subComment.set("username", currentUser.get('username'));
        subComment.set("text", comment.commentText);
        subComment.save(null, {
        success: function(subComment) {
                parentComment.add("sub_comment", subComment);
                parentComment.save();
            }
        });
        var subCmt = {};
        if (!comment.sub_comment) {
            comment.sub_comment = [];
        }
        subCmt.userId = currentUser.id;
        subCmt.username =  currentUser.get('name');
        subCmt.commentText =  comment.commentText
        comment.sub_comment.push(subCmt);
        comment.sub_comments_count += 1;
        comment.commentText = "";
        $scope.$apply();
    }
}]);