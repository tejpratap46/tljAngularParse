var tmdbapikey = "72cae7941bfe23850229828662c9e4b8";

function setNav (activeId) {
	$('#navHome').removeClass('active');
	$('#navMovie').removeClass('active');
	$('#navTv').removeClass('active');
	$('#navMusic').removeClass('active');
	$('#navPodcast').removeClass('active');
	$(activeId).addClass('active');
}

function checkIfLoggedIn () {
	var currentUser = Parse.User.current();
	if (currentUser) {
	    var loginViewData = "<li class='dropdown'><a class='dropdown-toggle' data-toggle='dropdown' role='button' aria-expanded='false'>" + currentUser.get('username') + "<span class='caret'></span></a>"
							+ "<ul class='dropdown-menu' role='menu'>"
							+ "<li><a href='#/profile'>Profile</a></li>"
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

function addMovieWatchlist($index,tmdbid,imdbid,name,image){
    var MovieWatchList = Parse.Object.extend("MovieWatchList");
    var movie = new MovieWatchList();

    var query = new Parse.Query(MovieWatchList);
    query.equalTo("TMDBID", tmdbid + "");
    query.find({
    success: function(results) {
        if(results.length > 0){
            $('.notification').first().text('Error : Movie Already In Your Watchlist').show('fast').delay(3000).hide('fast');
            toggleButton($index);
        }else{
            addMovie($index,movie,tmdbid,name,image);
        }
    },
    error: function(error) {
        $('.notification').first().text('Error : ' + error.message).show('fast').delay(3000).hide('fast');
    }
    });
}

function addMovieWatched($index,tmdbid,imdbid,name,image){
    var MovieWatched = Parse.Object.extend("MovieWatched");
    var movie = new MovieWatched();
    
    var query = new Parse.Query(MovieWatched);
    query.equalTo("TMDBID", tmdbid + "");
    query.find({
    success: function(results) {
        if(results.length > 0){
            $('.notification').first().text('Error : Movie Already In Your Watchlist').show('fast').delay(3000).hide('fast');
            toggleButton($index);
            eModal.confirm("Want To Remove It", "Already Added")
                .then(deleteMovie, null);
        }else{
            addMovie($index,movie,tmdbid,name,image);
        }
    },
    error: function(error) {
        $('.notification').first().text('Error : ' + error.message).show('fast').delay(3000).hide('fast');
    }
    });
}

function addMovie($index,movie,tmdbid,name,image){
    movie.set("TMDBID", tmdbid + "");
    movie.set("name", name);
    movie.set("image", image);
    movie.set("isDeleted", false);
    var user = Parse.User.current();
    if (user != null){
        window.location.hash = '#/login';
        return false;
    }else{
        movie.setACL(new Parse.ACL(user));
    }

    $('.notification').first().text('Loading...').show('fast');
    movie.save(null, {
        success: function(movie) {
            $('.notification').first().hide('fast');
            toggleButton($index);
        },
    error: function(movie, error) {
			$('.notification').first().text('Error : ' + error.message).show('fast').delay(3000).hide('fast');
        }
    });
}

function toggleButton($index){
    if($index == -1){
        $('#movieWatched').eq($index).removeClass('btn-info').addClass('btn-danger');
    }else{
        $('.movieWatched').eq($index).removeClass('btn-info').addClass('btn-danger');
    }
}