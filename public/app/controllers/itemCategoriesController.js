define(['app'], function(app) {
    app.register.controller('itemCategoriesController', ['$scope', '$http', '$location', function($scope, $http, $location) {
        $scope.itemCategories = [];

        $http.get('/api/itemCategories').then(function(data) {
            $scope.itemCategories = data.data;
        });

        $scope.add = function() {
            $location.path("/itemCategory");
        }

        $scope.edit = function(itemCategory) {
            $location.path("/itemCategory/" + itemCategory._id);
        }

        $scope.select = function(itemCategory) {
            $location.path("/itemCategories/" + itemCategory._id + "/items");
        }

        $scope.sync = function() {
            $http.get('/api/itemCategories/sync').then(function(data) {});
        }
    }]);
});
