(function() {
    'use strict';
    angular
        .module('myApp', [])
        .controller('myCtrl', myCtrl);

    function myCtrl ($scope, LinkService) {

        $scope.showError = false;

        $scope.getShortenedLink = function(originalLink) {

            $scope.requested = false;
            $scope.complete = false;

            if(!$scope.linkForm.$valid) {
                $scope.requeted = false;
                $scope.complete = false;
                $scope.showError = true;
                $scope.error = '您输入的URL格式不正确,请重新输入';
                $scope.shortenedLink = '';
            } else {
                $scope.requested = true;
                $scope.complete = false;
                $scope.showError = false;
                $scope.error = '';

                var reqLink = {
                    'originalLink': originalLink
                };

                LinkService.getShortenedLink(reqLink)
                    .then(function (response){
                        $scope.shortenedLink = response;
                        $scope.complete = true;
                    });
            }

        }
    }

})();