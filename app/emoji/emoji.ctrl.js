(function () {
    'use strict';

    angular
        .module('main')
        .controller('EmojiCtrl', EmojiCtrl);

    function EmojiCtrl($scope, DEFAULT_IMAGE, $cookieStore, EmojiService, AdminQuotesService, $log) {
        var vm = this;

        vm.checkAnswers = [];
        vm.quote = {};
        vm.quotes = [];
        vm.emojis = [];
        vm.containers = [];
        vm.win = false;
        vm.toDo = !$cookieStore.get('todoHidden');

        vm.DEFAULT_IMAGE = DEFAULT_IMAGE;

        var random = EmojiService.Random;
        var getEmojisFromWords = EmojiService.getEmojisFromWords;
        var getEmoji = EmojiService.getEmoji;
        var Quote = EmojiService.Quote;
        var Emoji = EmojiService.Emoji;

        var getRandomQuote = _getRandomQuote;
        var getUserAnswers = _getUserAnswers;

        vm.getUserAnswerLength = getUserAnswerLength;
        vm.nextQuote = nextQuote;
        vm.checkAnswer = checkAnswer;
        vm.getUserAnswerLength = getUserAnswerLength;
        vm.closeTodo = closeTodo;

        $scope.getOptionsContainer = getOptionsContainer;

        function closeTodo() {
            $cookieStore.put('todoHidden', true);
            vm.toDo = !$cookieStore.get('todoHidden');
        }

        function _getRandomQuote(quotes) {
            var _random = random.getRandomInt(0, quotes.length - 1);
            console.log(quotes[_random]);
            return quotes[_random].slug;
        }

        function _getUserAnswers(containers) {
            var userAnswers = [];
            var position = 0;

            for (var i = 0; i < containers.length; i++) {

                if (!Array.isArray(containers[i].item)) continue;
                userAnswers.push(new Emoji(containers[i].item[0].code, position));
                position++;

            }

            return userAnswers;
        }

        function getUserAnswerLength() {
            var userAnswersLength = 0;

            for (var k = 0; k < vm.containers.length; k++) {
                if (!Array.isArray(vm.containers[k].item)) continue;
                if (vm.containers[k].item.length !== 0) userAnswersLength += 1;
            }
            return userAnswersLength;
        }

        function nextQuote() {
            getQuote(getRandomQuote(vm.quotes));
        }

        function checkAnswer() {
            var result = [];
            var position = 0;

            function in_array(value, array) {
                for (var i = 0; i < array.length; i++) {
                    if (array[i] == value) return true;
                }
                return false;
            }

            if (vm.getUserAnswerLength() === vm.checkAnswers.length) {
                var userAnswers = getUserAnswers(vm.containers);
                for (var j = 0; j < userAnswers.length; j++) {
                    vm.checkAnswers[j].code === userAnswers[j].code ? result.push(true) : result.push(false);
                }

                console.log(result);

                for (var i = 0; i < vm.containers.length; i++) {

                    if (!Array.isArray(vm.containers[i].item)) continue;
                    if (!result[position]) {
                        vm.emojis[vm.containers[i].item[0].jqyoui_pos] = new Emoji(vm.containers[i].item[0].code, i);
                        vm.containers[i].item.splice(0, 1);
                    }
                    position++;

                }

                console.log(vm.emojis);
                !in_array(false, result) ? vm.win = true : vm.win = false;
            }
        }

        function getOptionsContainer(container) {
            return {
                accept: function (dragEl) {
                    if (container.length >= 1) {
                        return false;
                    } else {
                        return true;
                    }
                }
            }
        }

        function getQuotes() {
            function success(response) {
                response.data.objects.forEach(function (quote) {
                    vm.quotes.push(
                        new Quote(
                            getEmojisFromWords(quote.metadata.text),
                            quote.metadata.author,
                            quote.slug
                        )
                    );
                });
                $log.info(vm.quotes);

                getQuote(getRandomQuote(vm.quotes));

            }

            function failed(response) {
                $log.error(response);
            }

            AdminQuotesService
                .getQuotes(true)
                .then(success, failed);
        }

        function getQuote(slug) {
            function success(response) {
                vm.quote = new Quote(
                    getEmojisFromWords(response.data.object.metadata.text),
                    response.data.object.metadata.author,
                    response.data.object.slug
                );

                vm.emojis = [];
                vm.containers = [];
                vm.checkAnswers = [];
                vm.win = false;

                getEmoji(
                    vm.quote,
                    vm.emojis,
                    vm.containers,
                    vm.checkAnswers
                );

                vm.emojis.sort(function (a, b) {
                    return a.code.charCodeAt(1) - b.code.charCodeAt(2)
                });

                vm.emojis.reverse();
                console.log('emojis', vm.emojis);
            }

            function failed(response) {
                $log.error(response);
            }

            AdminQuotesService
                .getQuoteBySlug(slug)
                .then(success, failed);
        }

        getQuotes();
        
        $('.emoji').draggable(); // FOR TouchScreen
    }
})();
