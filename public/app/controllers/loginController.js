define(['app'], function(app) {
    app.register.controller('loginController', ['$scope', '$http', '$location', 'authorization', function($scope, $http, $location, authorization) {       
        $scope.authenticationFailed = false;
        $scope.login = function() {
            authorization.authenticate($scope.user).then(function(result) {
                $scope.authenticationFailed = !result;
                if (result) $location.path("/itemCategories");
            });
        }
    }]);
});
