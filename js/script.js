var tmdbapikey = "72cae7941bfe23850229828662c9e4b8";
var userMoviesWatchlistNames = [];
var userMoviesWatchedNames = [];
var userMoviesLikedNames = [];
var userMoviesWatchlist = [];
var userMoviesWatched = [];
var userMoviesLiked = [];

// scroll
//var lastScrollTop = 0;
//$(window).scroll(function(event){
//   var st = $(this).scrollTop();
//   if (st > lastScrollTop){
//       $('.search').first().slideUp();
//   } else {
//       $('.search').first().slideDown();
//   }
//   lastScrollTop = st;
//});

function setNav (activeId) {
	$('#navHome').removeClass('active');
	$('#navStart').removeClass('active');
	$('#navDiscover').removeClass('active');
	$(activeId).addClass('active');
}

function checkIfLoggedIn() {
	var currentUser = Parse.User.current();
	if (currentUser) {
	    var loginViewData = "<li><a href='#/user'>" + currentUser.get('username') + "<span class='caret'></span></a></li><li><a href='#/logout'>Logout</a></li>";
   		$('#navLoggedIn').html(loginViewData);
	} else {
   		$('#navLoggedIn').html('<a type="button" class="btn btn-default navbar-btn" href="#/login">Sign in</a>');
	}
}

function getUserMoviesWatchlist(){
    var MovieWatchList = Parse.Object.extend("MovieWatchList");
    var movie = new MovieWatchList();
    var query = new Parse.Query(MovieWatchList);
    query.equalTo("is_deleted", false);
    query.limit(1000);
    query.descending("updatedAt");
    query.find({
    success: function(results) {
        userMoviesWatchlist = results;
        for (var i=0; i< results.length; i++){
            userMoviesWatchlistNames.push(results[i].get('title'));
        }
    },
    error: function(error) {}
    });
}

function getUserMoviesWatched(){
    var MovieWatchList = Parse.Object.extend("MovieWatched");
    var movie = new MovieWatchList();
    var query = new Parse.Query(MovieWatchList);
    query.equalTo("is_deleted", false);
    query.limit(1000);
    query.descending("updatedAt");
    query.find({
    success: function(results) {
        userMoviesWatched = results;
        for (var i=0; i< results.length; i++){
            userMoviesWatchedNames.push(results[i].get('title'));
        }
    },
    error: function(error) {}
    });
}

function getUserMoviesLiked(){
    var MovieWatchList = Parse.Object.extend("MovieLiked");
    var movie = new MovieWatchList();
    var query = new Parse.Query(MovieWatchList);
    query.equalTo("is_deleted", false);
    query.limit(1000);
    query.descending("updatedAt");
    query.find({
    success: function(results) {
        userMoviesLiked = results;
        for (var i=0; i< results.length; i++){
            userMoviesLikedNames.push(results[i].get('title'));
        }
    },
    error: function(error) {}
    });
}

function showMovieTrailer($index, tmdbid){
    $('.notification').first().text('Loading ...').show('fast');
    $.getJSON('http://api.themoviedb.org/3/movie/' + tmdbid + '/videos?api_key=' + tmdbapikey, function(json, textStatus) {
    $('.notification').first().hide('fast');
		eModal.iframe('http://www.youtube.com/embed/' + json.results[0].key + '?autoplay=1', 'Trailer');
    });
}

function addMovieWatchlist($index,tmdbid,name,image,genre,release,vote_average){
    var MovieWatchList = Parse.Object.extend("MovieWatchList");
    var movie = new MovieWatchList();
    var query = new Parse.Query(MovieWatchList);
    query.equalTo("tmdb_id", tmdbid + "");
    query.find({
    success: function(results) {
        if(results.length > 0){
            var object = results[0];
            if(object.get('is_deleted') == true){
                $('.notification').first().text('Loading...').show('fast');
                object.set('is_deleted',false);
                object.save(null, {
                    success: function(movie) {
                        $('.notification').first().hide('fast');
                        toggleButtonAdded($index, "movieWatchlist");
                        userMoviesWatchlistNames.push(name);
                    },
                error: function(movie, error) {
                        $('.notification').first().text('Oops! ' + error.message).show('fast').delay(3000).hide('fast');
                    }
                });
            }else{
                $('.notification').first().text('Oops! Movie Already In Your Watchlist').show('fast').delay(3000).hide('fast');
                toggleButtonAdded($index, "movieWatchlist");
                globalmovie = object;
                globalIndex = $index;
                globalbutton = "movieWatchlist";
                eModal.confirm("Want To Remove It", "Already Added").then(deleteMovie, deleteMovieCancel);
            }
        }else{
            addMovie($index,movie,tmdbid,name,image,genre,release,vote_average, "movieWatchlist");
        }
    },
    error: function(error) {
        $('.notification').first().text('Oops! ' + error.message).show('fast').delay(3000).hide('fast');
    }
    });
}

function addMovieWatched($index,tmdbid,name,image,genre,release,vote_average){
    var MovieWatched = Parse.Object.extend("MovieWatched");
    var movie = new MovieWatched();

    var query = new Parse.Query(MovieWatched);
    query.equalTo("tmdb_id", tmdbid + "");
    query.find({
        success: function(results) {
        if(results.length > 0){
            var object = results[0];
            if(object.get('is_deleted') == true){
                $('.notification').first().text('Loading...').show('fast');
                object.set('is_deleted',false);
                object.save(null, {
                    success: function(movie) {
                        $('.notification').first().hide('fast');
                        toggleButtonAdded($index, "movieWatched");
                        userMoviesWatchedNames.push(name);
                    },
                error: function(movie, error) {
                        $('.notification').first().text('Oops! ' + error.message).show('fast').delay(3000).hide('fast');
                    }
                });
            }else{
                $('.notification').first().text('Oops! Movie Already In Your Watchlist').show('fast').delay(3000).hide('fast');
                toggleButtonAdded($index, "movieWatched");
                globalmovie = object;
                globalIndex = $index;
                globalbutton = "movieWatched";
                eModal.confirm("Want To Remove It", "Already Added").then(deleteMovie, deleteMovieCancel);
            }
        }else{
            addMovie($index,movie,tmdbid,name,image,genre,release,vote_average, "movieWatched");
        }
    },
    error: function(error) {
        $('.notification').first().text('Oops! ' + error.message).show('fast').delay(3000).hide('fast');
    }
    });
}
// dows not prompt to remove it if already added, used in comments and status
function addMovieWatchedSilent($index,tmdbid,name,image,genre,release,vote_average){
    var MovieWatched = Parse.Object.extend("MovieWatched");
    var movie = new MovieWatched();

    var query = new Parse.Query(MovieWatched);
    query.equalTo("tmdb_id", tmdbid + "");
    query.find({
        success: function(results) {
        if(results.length > 0){
            var object = results[0];
            if(object.get('is_deleted') == true){
                $('.notification').first().text('Loading...').show('fast');
                object.set('is_deleted',false);
                object.save(null, {
                    success: function(movie) {
                        $('.notification').first().hide('fast');
                        toggleButtonAdded($index, "movieWatched");
                        userMoviesWatchedNames.push(name);
                    },
                error: function(movie, error) {
                        $('.notification').first().text('Oops! ' + error.message).show('fast').delay(3000).hide('fast');
                    }
                });
            }
        }else{
            addMovie($index,movie,tmdbid,name,image,genre,release,vote_average, "movieWatched");
        }
    },
    error: function(error) {
        $('.notification').first().text('Oops! ' + error.message).show('fast').delay(3000).hide('fast');
    }
    });
}

function addMovieLiked($index,tmdbid,name,image,genre,release,vote_average){
    var MovieWatched = Parse.Object.extend("MovieLiked");
    var movie = new MovieWatched();

    var query = new Parse.Query(MovieWatched);
    query.equalTo("tmdb_id", tmdbid + "");
    query.find({
        success: function(results) {
        if(results.length > 0){
            var object = results[0];
            if(object.get('is_deleted') == true){
                $('.notification').first().text('Loading...').show('fast');
                object.set('is_deleted',false);
                object.save(null, {
                    success: function(movie) {
                        $('.notification').first().hide('fast');
                        toggleButtonAdded($index, "movieLiked");
                        userMoviesLikedNames.push(name);
                    },
                error: function(movie, error) {
                        $('.notification').first().text('Oops! ' + error.message).show('fast').delay(3000).hide('fast');
                    }
                });
            }else{
                $('.notification').first().text('Oops! Movie Already In Your Watchlist').show('fast').delay(3000).hide('fast');
                toggleButtonAdded($index, "movieLiked");
                globalmovie = object;
                globalIndex = $index;
                globalbutton = "movieLiked";
                eModal.confirm("Want To Remove It", "Already Added").then(deleteMovie, deleteMovieCancel);
            }
        }else{
            addMovie($index,movie,tmdbid,name,image,genre,release,vote_average, "movieLiked");
        }
    },
    error: function(error) {
        $('.notification').first().text('Oops! ' + error.message).show('fast').delay(3000).hide('fast');
    }
    });
}

function deleteMovie(){
    console.log('Delete Ok');
    globalmovie.set("is_deleted", true);

    $('.notification').first().text('Loading...').show('fast');
    globalmovie.save(null, {
        success: function(movie) {
            $('.notification').first().hide('fast');
            toggleButtonRemoved(globalIndex, globalbutton);
            if (globalbutton == "movieWatchlist"){
                var index = userMoviesWatchlistNames.indexOf(globalmovie.get('name'));
                if (index > -1) {
                    userMoviesWatchlistNames.splice(index, 1);
                }
            }else if(globalbutton == "movieWatched"){
                var index = userMoviesWatchedNames.indexOf(globalmovie.get('name'));
                if (index > -1) {
                    userMoviesWatchedNames.splice(index, 1);
                }
            }else{
                var index = userMoviesLikedNames.indexOf(globalmovie.get('name'));
                if (index > -1) {
                    userMoviesLikedNames.splice(index, 1);
                }
            }
        },
    error: function(movie, error) {
			$('.notification').first().text('Oops! ' + error.message).show('fast').delay(3000).hide('fast');
        }
    });
}

function deleteMovieCancel(){
    console.log('Delete Cancel');
}

function addMovie($index,movie,tmdbid,name,image,genre,release,vote_average, buttonId){
    movie.set("tmdb_id", tmdbid + "");
    movie.set("title", name);
    movie.set("poster_path", image);
    movie.set("genre", genre);
    movie.set("release_date", release);
    movie.set("vote_average", vote_average);
    movie.set("is_deleted", false);
    var user = Parse.User.current();
    if (user == null){
        eModal.confirm("Create a account in just 10 sec, and track all your entertainment life.", "Login").then(loginOk, loginCancel);
        return false;
    }else{
        movie.set("created_by", user);
        movie.setACL(new Parse.ACL(user));
    }
    var username = user.get("username");
    movie.set("username", username);
    $('.notification').first().text('Adding...').show('fast');
    movie.save(null, {
        success: function(movie) {
            $('.notification').first().hide('fast');
            toggleButtonAdded($index, buttonId);
            if(buttonId == "movieWatchlist"){
                userMoviesWatchlistNames.push(name);
            }else if(buttonId == "movieWatched"){
                userMoviesWatchedNames.push(name);
            }else{
                userMoviesLikedNames.push(name);
            }
        },
    error: function(movie, error) {
			$('.notification').first().text('Oops! ' + error.message).show('fast').delay(3000).hide('fast');
        }
    });
}

function loginAlert(){
    eModal.confirm("Create a account in just 10 sec, and track all your entertainment life.", "Login").then(loginOk, loginCancel);
}

function loginOk(){
    window.location.hash = "#/login";
}

function loginCancel(){
    console.log('Login Cancel');
}

function toggleButtonAdded($index, buttonId){
    if($index == -1){
        $('#' + buttonId).eq($index).addClass('btn-danger');
    }else{
        $('.' + buttonId).eq($index).addClass('btn-danger');
    }
}

function toggleButtonRemoved($index, buttonId){
    if($index == -1){
        $('#' + buttonId).eq($index).removeClass('btn-danger');
    }else{
        $('.' + buttonId).eq($index).removeClass('btn-danger');
    }
}
