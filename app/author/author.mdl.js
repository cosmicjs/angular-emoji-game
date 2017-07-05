(function () {
    'use strict';

    angular
        .module('author', [])
        .config(config);

    config.$inject = ['$stateProvider', '$urlRouterProvider'];
    function config($stateProvider, $urlRouterProvider) {

        $stateProvider
            .state('main.author', {
                url: 'author/:slug',
                templateUrl: '../views/author/author.html',
                controller: 'AuthorCtrl as vm',
                data: {
                    is_granted: ['ROLE_GUEST']
                }
            });
    }
})();
 