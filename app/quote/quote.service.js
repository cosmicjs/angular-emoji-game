(function () {
    'use strict';

    angular
        .module('main')
        .service('QuoteService', function ($http,
                                          $cookieStore, 
                                          $q, 
                                          $rootScope,
                                          URL, BUCKET_SLUG, READ_KEY, WRITE_KEY, MEDIA_URL) {

            $http.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

            var that = this;

            that.getQuotes = function (ignoreLoadingBar) {
                return $http.get(URL + BUCKET_SLUG + '/object-type/quotes', {
                    ignoreLoadingBar: ignoreLoadingBar,
                    params: {
                        read_key: READ_KEY
                    }
                });
            };

            that.getQuote = function (slug, ignoreLoadingBar) {
                return $http.get(URL + BUCKET_SLUG + '/object/' + slug, {
                    ignoreLoadingBar: ignoreLoadingBar,
                    params: {
                        read_key: READ_KEY
                    }
                });
            };

        });
})();  