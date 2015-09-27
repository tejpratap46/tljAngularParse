var tmdbapikey = "72cae7941bfe23850229828662c9e4b8";
var userMoviesWatchlistNames = [];
var userMoviesWatchedNames = [];
var userMoviesLikedNames = [];
var userMoviesWatchlist = [];
var userMoviesWatched = [];
var userMoviesLiked = [];

function setNav (activeId) {
	$('#navHome').removeClass('active');
	$('#navMovie').removeClass('active');
	$('#navTv').removeClass('active');
	$('#navMusic').removeClass('active');
	$('#navPodcast').removeClass('active');
	$(activeId).addClass('active');
}

function checkIfLoggedIn() {
	var currentUser = Parse.User.current();
	if (currentUser) {
	    var loginViewData = "<li class='dropdown'><a class='dropdown-toggle' data-toggle='dropdown' role='button' aria-expanded='false'>" + currentUser.get('username') + "<span class='caret'></span></a>"
							+ "<ul class='dropdown-menu' role='menu'>"
							+ "<li><a href='#/user/movie'>My Movies</a></li>"
                            + "<li><a href='#/user/tv'>My Shows</a></li>"
                            + "<li><a href='#/user/music'>My Music</a></li>"
                            + "<li><a href='#/user/podcast'>My Pocasts</a></li>"
							+ "<li class='divider'></li>"
							+ "<li class='dropdown-header'>Say Good Bye</li>"
							+ "<li><a href='#/logout'>Logout</a></li>"
							+ "</ul>"
							+ "</li>";
   		$('#navLoggedIn').html(loginViewData);
	} else {
   		$('#navLoggedIn').html('<a type="button" class="btn btn-default navbar-btn" href="#/login">Sign in</a>');
	}
}

function getUserMoviesWatchlist(){
    var MovieWatchList = Parse.Object.extend("MovieWatchlist");
    var movie = new MovieWatchList();
    var query = new Parse.Query(MovieWatchList);
    query.equalTo("is_deleted", false);
    query.limit(1000);
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
		eModal.iframe('http://www.youtube.com/embed/' + json.results[0].key + '?autoplay=1', '');
    });
}

function addMovieWatchlist($index,tmdbid,name,image,genre,release){
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
            addMovie($index,movie,tmdbid,name,image,genre,release, "movieWatchlist");
        }
    },
    error: function(error) {
        $('.notification').first().text('Oops! ' + error.message).show('fast').delay(3000).hide('fast');
    }
    });
}

function addMovieWatched($index,tmdbid,name,image,genre,release){
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
            addMovie($index,movie,tmdbid,name,image,genre,release, "movieWatched");
        }
    },
    error: function(error) {
        $('.notification').first().text('Oops! ' + error.message).show('fast').delay(3000).hide('fast');
    }
    });
}

function addMovieLiked($index,tmdbid,name,image,genre,release){
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
            addMovie($index,movie,tmdbid,name,image,genre,release, "movieLiked");
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

function addMovie($index,movie,tmdbid,name,image,genre,release, buttonId){
    movie.set("tmdb_id", tmdbid + "");
    movie.set("title", name);
    movie.set("poster_path", image);
    movie.set("genre", genre);
    movie.set("release_date", release);
    movie.set("is_deleted", false);
    var user = Parse.User.current();
    if (user == null){
        eModal.confirm("Create a account in just 10 sec, and track all your entertainment life.", "Login").then(loginOk, loginCancel);
        return false;
    }else{
        movie.setACL(new Parse.ACL(user));
    }

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