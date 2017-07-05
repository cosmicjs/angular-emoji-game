(function () {
    'use strict';
    
    angular
        .module('emoji', [])
        .config(config);

    config.$inject = ['$stateProvider', '$urlRouterProvider'];
    function config($stateProvider, $urlRouterProvider) {
 
        $stateProvider
            .state('main.emoji', {
                url: '',
                templateUrl: '../views/emoji/emoji.html',
                controller: 'EmojiCtrl as emojiCtrl'
            });
    }
})();
 