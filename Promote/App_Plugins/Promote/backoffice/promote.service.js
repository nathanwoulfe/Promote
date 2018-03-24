(function () {
  'use strict';

  function promoteService($http, umbRequestHelper) {

    var urlBase = '/umbraco/backoffice/api/promote/promos/';

    var service = {
      request: function (method, url, data) {
        return umbRequestHelper.resourcePromise( 
            method === 'GET' ?
                $http.get(url) :
                $http.post(url, data),
            'Something broke'
        );
      },
      getByUdi: function (udi) {
        return this.request('GET', urlBase + 'getByUdi?udi=' + udi); 
      },
      getPromos: function () {
        return this.request('GET', urlBase + 'get');
      },
      savePromos: function (promos) {
        return this.request('POST', urlBase + 'save', promos);
      },
    };

    return service;

  }

  angular.module('umbraco').service('promoteService', ['$http', 'umbRequestHelper', promoteService]);

}());