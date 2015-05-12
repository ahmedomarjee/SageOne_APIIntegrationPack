define(['app', 'factories/authorization'], function(app) {
    app.register.controller('applicationController', ['$scope', '$location', 'authorization', function($scope, $location, authorization) {
        $scope.authorization = authorization;

        $scope.logout = function() {
            $scope.authorization.logout().then(function() {
                $location.path("/");
            });
        }

        $scope.$on('$routeChangeSuccess', function(a,c) {
    		if($scope.authorization.isAuthenticated())
				$('body').css("background-color","white");
			else
				$('body').css("background-color","#F7F7F7");
        });

    }]);
});
