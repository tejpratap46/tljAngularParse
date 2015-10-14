var app = angular.module('tlj');

app.controller('peopleListController', function($scope, $http, $routeParams, $window){
	setNav('#navStart');
    document.title = "Popular actors and actresses";
    $('html,body').scrollTop(0);
    
    var page = 0;
    $scope.casts = [];
    
    angular.element($window).bind("scroll", function() {
        var windowHeight = "innerHeight" in window ? window.innerHeight : document.documentElement.offsetHeight;
        var body = document.body, html = document.documentElement;
        var docHeight = Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight,  html.scrollHeight, html.offsetHeight);
        windowBottom = windowHeight + window.pageYOffset;
        if (windowBottom >= docHeight - 10) {
            $('.notification').first().text('Loading More...').show('fast');
            $http.get("http://api.themoviedb.org/3/person/popular?api_key=" + tmdbapikey + "&page=" + (++page))
                .success(function(response) {
                $('.notification').first().hide('fast');
                    response.results.forEach(function(people){
                        $scope.casts.push(people);
                        $scope.$apply();
                    });
            });
        }
    });
    
    $('.notification').first().text('Loading...').show('fast');
    $http.get("http://api.themoviedb.org/3/person/popular?api_key=" + tmdbapikey + "&page=" + (++page))
        .success(function(response) {
            $('.notification').first().hide('fast');
            $scope.casts = response.results;
            $scope.$apply();
    });
});