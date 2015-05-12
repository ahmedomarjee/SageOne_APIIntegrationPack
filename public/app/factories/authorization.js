define(['app', 'factories/authorization'], function(app) {
    app.register.factory('authorization', ['$http', '$q', '$window', function($http, $q, $window) {
        var user = JSON.parse(sessionStorage.getItem("user"));
        var token = sessionStorage.getItem("token");
        var setUser = function(v) {
            user = v;
            if (user)
                sessionStorage.setItem("user", JSON.stringify(user));
            else
                sessionStorage.removeItem("user")
        };
        var setToken = function(v) {
            token = v;
            if (token)
                sessionStorage.setItem("token", token);
            else
                sessionStorage.removeItem("token")
        };
        return {
            user: function() {
                return user
            },
            token: function() {
                return token
            },
            authenticate: function(credentials) {
                var dfd = $q.defer();
                $http.post('/login', credentials)
                    .then(function(response) {
                        if (response.data) {
                            setUser(response.data.user);
                            setToken(response.data.token);
                            dfd.resolve(true);
                        }
                    }, function(response) {
                        dfd.resolve(false);
                    });
                return dfd.promise;
            },
            signUp: function(credentials) {
                var dfd = $q.defer();
                $http.post('/signUp', credentials)
                    .then(function(response) {
                        if (response.data) {
                            setUser(response.data.user);
                            setToken(response.data.token);
                            dfd.resolve(true);
                        }
                    }, function(response) {
                        dfd.resolve(false);
                    });
                return dfd.promise;
            },
            logout: function() {
                var dfd = $q.defer();
                $http.post('/logout', {
                    logout: true
                }).then(function() {
                    setUser(undefined);
                    setToken(undefined);
                    dfd.resolve();
                });
                return dfd.promise;
            },
            isAuthenticated: function() {
                return !!user;
            },
            isAuthorized: function(role) {
                return !!user && user.roles.indexOf(role) > -1;
            }
        }
    }]);
});
