var app = angular.module('tlj');

app.registerCtrl('listHomeController', ['$scope', '$routeParams', '$window', function($scope, $routeParams, $window){
	setNav('#navHome');
    var page = 0;
    $scope.movieList = [];
    $routeParams.name = typeof $routeParams.name !== 'undefined' ? $routeParams.name : 'MovieWatched';
    angular.element($window).bind("scroll", function() {
        var windowHeight = "innerHeight" in window ? window.innerHeight : document.documentElement.offsetHeight;
        var body = document.body, html = document.documentElement;
        var docHeight = Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight,  html.scrollHeight, html.offsetHeight);
        windowBottom = windowHeight + window.pageYOffset;
        if (windowBottom >= docHeight - 10) {
            $('.notification').first().text('Loading...').show('fast');
            Parse.Cloud.run('getListCategories', {limit: 12, page: (++page)}, {
                success: function(results) {
                    $('.notification').first().hide('fast');
                    var moviesTemp = [];
                    results.forEach(function(object){
                        moviesTemp.push({
                            id: object.id,
                            name: object.get('list_name'),
                            image: object.get('image')
                        });
                    });
                    moviesTemp.forEach(function(object){
                        $scope.movieList.push(object);
                        $scope.$apply();
                    });
                },
                error: function(error) {
                    $('.notification').first().hide('fast');
                    // $('.notification').first().text('Error : ' + error.message).show('fast').delay(3000).hide('fast');
                }
            });
        }
    });
    
    $('.notification').first().text('Loading...').show('fast');
    Parse.Cloud.run('getListCategories', {limit: 12, page: (++page)}, {
        success: function(results) {
            $('.notification').first().hide('fast');
            var moviesTemp = [];
            results.forEach(function(object){
                moviesTemp.push({
                    id: object.id,
                    name: object.get('list_name'),
                    image: object.get('image')
                });
            });
            moviesTemp.forEach(function(object){
                $scope.movieList.push(object);
                $scope.$apply();
            });
        },
        error: function(error) {
            $('.notification').first().text('Error : ' + error.message).show('fast').delay(3000).hide('fast');
        }
    });
}]);