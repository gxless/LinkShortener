(function() {
    'use strict';
    angular
        .module('myApp', [])
        .controller('myCtrl', myCtrl);

    function myCtrl ($scope, LinkService) {

        $scope.showError = false;

        $scope.getShortenedLink = function(originalLink) {

            if(!$scope.linkForm.$valid) {
                $scope.showError = true;
                $scope.error = '您输入的URL格式不正确,请重新输入';
                $scope.shortenedLink = '';
            } else {
                $scope.showError = false;
                $scope.error = '';
                var reqLink = {
                    'originalLink': originalLink
                };

                LinkService.getShortenedLink(reqLink)
                    .then(function (response){
                        $scope.shortenedLink = response;
                    });
            }

        }
    }

})();