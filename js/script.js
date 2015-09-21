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
    query.equalTo("isDeleted", false);
    query.find({
    success: function(results) {
        if(results.length > 0){
            var object = results[0];
            $('.notification').first().text('Oops! Movie Already In Your Watchlist').show('fast').delay(3000).hide('fast');
            toggleButtonAdded($index, "movieWatchlist");
            eModal.confirm("Want To Remove It", "Already Added").then(deleteMovie($index, object,tmdbid,"movieWatchlist"), deleteMovieCancel);
        }else{
            addMovie($index,movie,tmdbid,name,image, "movieWatchlist");
        }
    },
    error: function(error) {
        $('.notification').first().text('Oops! ' + error.message).show('fast').delay(3000).hide('fast');
    }
    });
}

function addMovieWatched($index,tmdbid,imdbid,name,image){
    var MovieWatched = Parse.Object.extend("MovieWatched");
    var movie = new MovieWatched();
    
    var query = new Parse.Query(MovieWatched);
    query.equalTo("TMDBID", tmdbid + "");
    query.equalTo("isDeleted", false);
    query.find({
    success: function(results) {
        if(results.length > 0){
            var object = results[0];
            $('.notification').first().text('Oops! Movie Already In Your Watchlist').show('fast').delay(3000).hide('fast');
            toggleButtonAdded($index, "movieWatched");
            eModal.confirm("Want To Remove It", "Already Added").then(deleteMovie($index, object,tmdbid,"movieWatched"), deleteMovieCancel);
        }else{
            addMovie($index,movie,tmdbid,name,image, "movieWatched");
        }
    },
    error: function(error) {
        $('.notification').first().text('Oops! ' + error.message).show('fast').delay(3000).hide('fast');
    }
    });
}

function deleteMovie($index,movie,tmdbid,buttonId){
    console.log('Delete Ok');
    movie.set("isDeleted", true);
    
    $('.notification').first().text('Loading...').show('fast');
    movie.save(null, {
        success: function(movie) {
            $('.notification').first().hide('fast');
            toggleButtonRemoved($index, buttonId);
        },
    error: function(movie, error) {
			$('.notification').first().text('Oops! ' + error.message).show('fast').delay(3000).hide('fast');
        }
    });
}

function deleteMovieCancel(){
    console.log('Delete Cancel');
}

function addMovie($index,movie,tmdbid,name,image, buttonId){
    movie.set("TMDBID", tmdbid + "");
    movie.set("name", name);
    movie.set("image", image);
    movie.set("isDeleted", false);
    var user = Parse.User.current();
    if (user == null){
        eModal.confirm("Create a account in just 10 sec, and track all your entertainment life.", "Login").then(loginOk, loginCancel);
        return false;
    }else{
        movie.setACL(new Parse.ACL(user));
    }

    $('.notification').first().text('Loading...').show('fast');
    movie.save(null, {
        success: function(movie) {
            $('.notification').first().hide('fast');
            toggleButtonAdded($index, buttonId);
        },
    error: function(movie, error) {
			$('.notification').first().text('Oops! ' + error.message).show('fast').delay(3000).hide('fast');
        }
    });
}

function loginOk(){
    console.log('Login OK');
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