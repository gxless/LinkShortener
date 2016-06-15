(function () {
    'use strict';
    angular
        .module('myApp')
        .factory('LinkService', LinkService);

        function LinkService ($q, $http) {

            var api = {
                getShortenedLink: getShortenedLink
            };

            return api;

            function getShortenedLink(reqLink) {
                var deferred = $q.defer();
                $http.post('/originalLink', reqLink)
                    .success(function (response) {
                        deferred.resolve(response);
                    });

                return deferred.promise;
            }

        }

})();