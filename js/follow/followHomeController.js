var app = angular.module('tlj');

app.registerCtrl('followHomeController',['$scope', function($scope) {
	var currentUser = Parse.User.current();
	if (currentUser == null) {
        window.location.hash = '#/login';
        return;
    }
    var page = 0;
	$('.notification').first().text('Loading ...').show('fast');
    currentUser.fetch({
        success: function(user){
            following = typeof following !== 'undefined' ? following : [];
		    $scope.username = user.get('username');
		    $scope.following = user.get('following');
		    $scope.followString = "";
			$scope.findPeopleOnParse = findPeopleOnParse((++page), $scope.followString);
		}
    });
	$scope.peoples = [];

	$scope.searchPeople = function(){
		$scope.peoples = [];
		page = 1;
		$scope.findPeopleOnParse = findPeopleOnParse(page, $scope.followString);
	}

	function findPeopleOnParse(page,searchUsername) {
    	if (page == 1) {
			$scope.peoples = [];
    	};
		$('.notification').first().text('Loading ...').show('fast');
        Parse.Cloud.run('userList', {username: searchUsername, limit: 12, page: (page)},{
        success: function(results) {
            $('.notification').first().hide('fast');
            var userTemp = results;
            for(var i=0;i<userTemp.length;i++){
                userTemp[i].timeString = moment(userTemp[i].sortWith).fromNow();
                var index = $.inArray(userTemp[i].username, $scope.following);
                if (index >= 0){
                	userTemp[i].buttonTheme = "danger";
                	userTemp[i].followText = "following";
                }else if (userTemp[i].username == $scope.username) {
	                	userTemp[i].buttonTheme = "link disabled";
	                	userTemp[i].followText = "you";
	            }else{
                	userTemp[i].buttonTheme = "success";
                	userTemp[i].followText = "Follow";
                }
                $scope.peoples.push(userTemp[i]);
                $scope.$apply();
            }
        },
        error: function(error) {
            $('.notification').first().text('Error ' + error.message).show('fast').delay(3000).hide('fast');}
        });
	}

	function random (items,outof) {
		var cardCount = 200, // total number of cards in your Card class
	    requestCount = 10, // number of random cards that you want to query
	    query1, query2, randomQuery,
	    queries = [],
	    i;
		for (i = 0; i < requestCount; i++) {
		    query1 = new Parse.Query(Parse.User);
		    query2 = new Parse.Query(Parse.User);
		    query1.skip(Math.floor(Math.random() * cardCount));
		    query1.limit(1);
		    query2.matchesKeyInQuery("objectId", "objectId", query1);
		    queries.push(query2);
		}
		randomQuery = Parse.Query.or.apply(this, queries);
		randomQuery.find().then(function(result) {
		    console.log(result);
		});
	}

	$scope.followUser = function($index,username){
        if ($scope.username == username) {
            return;
        }else{
            var index = $.inArray(username, $scope.following);
            if (index >= 0){
                $scope.peoples[$index].followText = "Follow";
                $scope.peoples[$index].buttonTheme = "success";
                newFollowing = jQuery.grep($scope.following, function(value) {
                    return value != username;
                });
                currentUser.set("following", newFollowing);
                currentUser.save(null, {
                success: function(comment) {
                    $scope.peoples[$index].followText = "Follow";
                    $scope.peoples[$index].buttonTheme = "success";
                	$scope.following = newFollowing;
        			$scope.$apply();
                },
                error: function(comment, error) {
                        $('.notification').first().text('Oops! ' + error.message).show('fast').delay(3000).hide('fast');
                    }
                });
            }else{
                $scope.peoples[$index].followText = "Following";
                $scope.peoples[$index].buttonTheme = "danger";
                currentUser.addUnique("following", username);
                currentUser.save(null, {
                success: function(comment) {
                    $scope.peoples[$index].followText = "Following";
                    $scope.peoples[$index].buttonTheme = "danger";
                    $scope.following.push(username);
        			$scope.$apply();
                },
                error: function(comment, error) {
                        $('.notification').first().text('Oops! ' + error.message).show('fast').delay(3000).hide('fast');
                    }
                });
            }
        }
    }
}]);