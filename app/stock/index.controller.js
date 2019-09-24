(function () {
  'use strict';

  angular
      .module('app')
      .controller('Stock.IndexController', Controller);

  function Controller(stockService, FlashService) {
      var vm = this;

      vm.item = {};
      vm.items = [];
      vm.saveItem = saveItem;
      vm.deleteItem = deleteItem;
      vm.editItem = editItem;

      initController();

      function initController() {
        getStock();        
      }

      function getStock(){
        stockService.getStock().then(function (items) {
          vm.items = items;
        });  
      }

      function saveItem() {
        if(vm.item._id){
          updateItem();          
        }else{
          createItem();
        }        
      }

      function createItem(){
        stockService.createItem(vm.item)
        .then(function () {
          FlashService.Success('Item Inseted');
          getStock(); 
          vm.item = {};
        })
        .catch(function (error) {
          FlashService.Error(error);
        });
      }

      function updateItem() {
        stockService.updateItem(vm.item)
          .then(function () {
              FlashService.Success('Item updated');
              vm.item = {};
          })
          .catch(function (error) {
              FlashService.Error(error);
          });
      }

      function editItem(item) {
        vm.item = item;
      }

      function deleteItem(item) {
        vm.item = item;
        stockService.deleteItem(vm.item._id)
        .then(function () {
            FlashService.Success('User deleted');
            getStock();
            vm.item = {};
        })
        .catch(function (error) {
            FlashService.Error(error);
        });
      }
  }

})();