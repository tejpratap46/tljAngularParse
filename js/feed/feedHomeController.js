var app = angular.module('tlj');

app.controller('feedHomeController', function($scope, $window, $routeParams){
    $scope.comments = [];
    $scope.loadComments = loadComments();
    function loadComments(){
        var comment = Parse.Object.extend("Comment");
        var query = new Parse.Query(comment);

        query.descending("votes");
        query.descending("createdAt");
        query.limit(10);
//        query.equalTo("tmdb_id", $routeParams.id);
        query.find({
        success: function(results) {
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
                commentsTemp.push({
                    id: object.id,
                    text: object.get('text'),
                    username: object.get('username'),
                    voted_by: votedBy,
                    votes: object.get('votes')
                });
            });
            commentsTemp.forEach(function(object){
                $scope.comments.push(object);
                $scope.$apply();
            });
        },
        error: function(error) {
            $('.notification').first().text('Error ' + error.message).show('fast').delay(3000).hide('fast');}
        });
    }
});