(function () {
  'use strict';

  angular
      .module('app')
      .factory('stockService', Service);

  function Service($http, $q) {
      var service = {};

      service.getStock = getStock;
      service.createItem = createItem;
      service.updateItem = updateItem;
      service.deleteItem = deleteItem;

      return service;

      function createItem(item) {
        return $http.post('/api/stock', item).then(handleSuccess, handleError);
      }

      function getStock() {
          return $http.get('/api/stock').then(handleSuccess, handleError);
      }

      function updateItem(item) {
          return $http.put('/api/stock/' + item._id, item).then(handleSuccess, handleError);
      }

      function deleteItem(_id) {
          return $http.delete('/api/stock/' + _id).then(handleSuccess, handleError);
      }
      
      function handleSuccess(res) {
          return res.data;
      }

      function handleError(res) {
          return $q.reject(res.data);
      }
  }

})();
