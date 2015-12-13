var page = 1;
var className = "Upcoming";
var type = "upcoming";
$.getJSON('http://api.themoviedb.org/3/movie/' + type + '?api_key=c2c73ebd1e25cbc29cf61158c04ad78a&page=' + page, function(json, textStatus) {
    var movies = json.results;
    var count = -1;
    movies.forEach(function(object){
        sleep(500);
        Parse.Cloud.run('addMovieToList', {id: object.id,list_name: className});
        console.log(++count);
    });
});

function sleep(milliseconds) {
  var start = new Date().getTime();
  for (var i = 0; i < 1e7; i++) {
    if ((new Date().getTime() - start) > milliseconds){
      break;
    }
  }
}