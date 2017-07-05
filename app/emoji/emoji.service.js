(function () {
    'use strict';

    angular
        .module('main')
        .service('EmojiService', function ($http,
                                          $cookieStore, 
                                          $q, 
                                          $rootScope,
                                          URL, BUCKET_SLUG, READ_KEY, WRITE_KEY, MEDIA_URL) {
            
            $http.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
            
            var that = this;

            that.Quote = function (text, author, slug) {
                this.text = text;
                this.author = author;
                this.slug = slug;
            };

            that.Emoji = function (code, position) {
                this.code = code;
                this.position = position;

                this.getEmoji = function () {
                    console.log('asc');
                }
            };

            that.Container = function (type, item) {
                this.type = type;
                this.item = item;
            };

            that.Random = {
                randNumOld: 0,
                getRandomInt: function (min, max) {
                    var randNum = Math.floor(Math.random() * (max - min + 1)) + min;
                    if (randNum == this.randNumOld) return this.getRandomInt(min, max);
                    this.randNumOld = randNum;

                    return randNum;
                }
            };

            this.getEmojisFromWords = function (quote) {
                var words = [];
                var word = '';

                quote += " ";

                for (var i = 0; i < quote.length; i++) {
                    if (quote[i] !== ' ') word += quote[i];
                    else {
                        words.push(word);
                        word = '';
                    }
                }

                for (var j = 0; j < words.length; j++) {
                    if (getMeAnEmoji(words[j]) !== "") words[j] = ":" + getMeAnEmoji(words[j]) + ":";
                }

                console.log(words);
                return words;
            };

            this.getEmoji = function (quote, emojis, containers, checkAnswers) {
                var i = 0;
                var position = 0;
                var result;
                var word = '';
                var isEmoji = new RegExp(":");
                var _quote = quote;

                while (i < quote.text.length) {
                    if (isEmoji.test(quote.text[i])) {
                        result = ( /\:(\w+)\:/.exec(quote.text) )[1];
                        emojis.push(new that.Emoji(":" + result + ":", i));
                        containers.push(new that.Container('emoji', []));
                        checkAnswers.push(new that.Emoji(":" + result + ":", position));

                        quote.text[i] = quote.text[i].replace(':' + result + ':', '_emoji_');

                        position++;
                    }
                    else {
                        containers.push(new that.Container('word', quote.text[i]));
                    }
                    word = '';
                    i++;
                }

                $http.get('/resources/emojis.json')
                    .success(function (data) {
                        for (var j = 0; j < 3; j++) {
                            emojis.push(new that.Emoji(":" + data[parseInt(Math.random() * data.length)] + ":"));
                        }
                    });

                // emojis.sort(function(a, b) {
                //     return a.code.charCodeAt(1) + b.code.charCodeAt(2)
                // });
                //
                // emojis.reverse();

                console.log(containers);

                return _quote;
            };

        });
})();  