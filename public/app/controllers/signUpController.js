define(['app'], function(app) {
    app.register.controller('signupController', ['$scope', '$http', '$location', 'authorization', function($scope, $http, $location, authorization) {
        $scope.signUp = function() {
            authorization.signUp($scope.user).then(function(result) {
                $scope.authenticationFailed = !result;
                if (result) $location.path("/itemCategories");
            });
        };
    }]);
});
