define(['services/routeResolver'], function() {

    var app = angular.module('legalwrite', ['ngRoute', 'routeResolverServices']);

    app.register = app;

    app.register.factory('authorizationInterceptor', ['$rootScope', '$q', '$window', function($rootScope, $q, $window) {
        return {
            request: function(config) {
                config.headers = config.headers || {};
                if ($window.sessionStorage.token) {
                    config.headers.Authorization = 'Bearer ' + $window.sessionStorage.token;
                }
                return config;
            },
            response: function(response) {
                if (response.status === 401) {
                    // handle the case where the user is not authenticated
                }
                return response || $q.when(response);
            }
        };
    }]);

    app.config(['$routeProvider', '$controllerProvider', '$compileProvider', '$filterProvider', '$provide', '$httpProvider', 'routeResolverProvider',
        function($routeProvider, $controllerProvider, $compileProvider, $filterProvider, $provide, $httpProvider, routeResolverProvider) {
            $httpProvider.interceptors.push('authorizationInterceptor');

            app.register = {
                controller: $controllerProvider.register,
                directive: $compileProvider.directive,
                filter: $filterProvider.register,
                factory: $provide.factory,
                service: $provide.service
            };

            var route = routeResolverProvider.route;
            $routeProvider
            //.when('/template', route.resolve('editTemplate')).when('/template/:id', route.resolve('editTemplate'))
                .when('/itemCategory', route.resolve('editItemCategory')).when('/itemCategory/:id', route.resolve('editItemCategory'))
                .when('/itemCategories/:categoryId/items', route.resolve('items'))
                .when('/itemCategories', route.resolve('itemCategories'))
                .when('/signup', route.resolve('signup'))
                .when('/', route.resolve('login'))
                .otherwise({
                    redirectTo: '/'
                });

        }
    ]);

    angular.element(document).ready(function() {
        require(['controllers/applicationController'], function() {
            angular.bootstrap(document, ['legalwrite']);
        });
    });

    return app;
});
