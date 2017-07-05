(function () {
    'use strict'; 

    angular
        .module('main')
        .controller('AdminAuthorsCtrl', AdminAuthorsCtrl);

    function AdminAuthorsCtrl($rootScope, $scope, Notification, AdminAuthorsService, Flash, $log) {
        var vm = this;

        vm.getAuthors = getAuthors; 
        vm.removeAuthor = removeAuthor;

        vm.authors = [];

        function getAuthors() {
            function success(response) {
                vm.authors = response.data.objects;

            }

            function failed(response) {
                $log.error(response);
            }

            AdminAuthorsService
                .getAuthors()
                .then(success, failed);
        }

        function removeAuthor(slug) {
            function success(response) {
                getAuthors();
                Notification.success(response.data.message);
            }

            function failed(response) {
                Notification.error(response.data.message);
            }

            AdminAuthorsService
                .removeAuthor(slug)
                .then(success, failed);
        }
    }
})();
