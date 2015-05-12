define(['app'], function(app) {
    app.register.controller('itemsController', ['$scope', '$http', '$location', '$routeParams', function($scope, $http, $location, $routeParams) {
        $scope.itemCategory = {};
        $scope.items = [];

        $http.get('/api/itemCategories/' + $routeParams.categoryId).then(function(data) {
            $scope.itemCategory = data.data;
        });

        $http.get('/api/itemCategories/' + $routeParams.categoryId + '/items').then(function(data) {
            $scope.items = data.data;
        });

        $scope.sync = function() {
            $http.get('/api/items/sync').then(function(data) {});
        }

        $scope.order = function(item) {
            $http.post('/api/items/' + item._id + '/order').then(function() {
                alert('thank you for your order');
            });
        }
    }]);
});
