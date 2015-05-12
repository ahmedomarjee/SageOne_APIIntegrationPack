define(['app','directives/focusElement'], function(app) {
    app.register.controller('editItemCategoryController', ['$scope', '$http', '$routeParams', '$location', function($scope, $http, $routeParams, $location) {
        $scope.itemCategory = {};

        if ($routeParams.id) {
            $http.get('/api/itemCategories/' + $routeParams.id).then(function(data) {
                $scope.itemCategory = data.data;
            });
        }

        $scope.save = function() {
            $http.post('/api/itemCategories/', $scope.itemCategory).then(function(data) {
                $location.path("/itemCategories");
            });
        }
    }]);
});
