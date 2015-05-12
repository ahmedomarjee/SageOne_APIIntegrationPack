define(['app'], function(app) {
    app.register.directive('focusElement', ['$timeout', function($timeout) {
        return {
            restrict: 'AE',
            scope: false,
            link: function(scope, element) {
                $timeout(function() {
                    element.focus();
                    element.select();
                }, 100);
            }
        };
    }]);
});
