﻿(function () {
  'use strict';

  function ctrl($scope, notificationsService, promoteService) {

    var vm = this;

    /**
     * Fetch the existing promo modules
     */
    promoteService.getPromos()
      .then(function(resp) {
        vm.promos = resp.data || [];
      });    

    /**
     * Save the new promo
     * @param {} $event 
     * @returns {} 
     */
    function save(hideNotification) {
      if (vm.newPromo && Object.keys(vm.newPromo).length) {
        vm.promos.push({
          guid: vm.newPromo.guid,
          name: vm.newPromo.name,
          nodeId: vm.newPromo.node ? vm.newPromo.node.id : null,
          contentTypeAlias: vm.newPromo.contentTypeAlias,
          additionalCss: vm.newPromo.additionalCss,
          additionalJs: vm.newPromo.additionalJs,
          applyTo: vm.newPromo.applyTo,
          selector: vm.newPromo.selector,
          attach: vm.newPromo.attach,
          linkUrl: vm.newPromo.link.url,
          linkId: vm.newPromo.link.id,
          imageSrc: vm.newPromo.imageSrc,
          imageId: vm.newPromo.image.id,
          markup: generateMarkup(vm.newPromo),
          querystring: vm.newPromo.querystring,
          disabled: false
        });
      }
      promoteService.savePromos(vm.promos)
        .then(function () {
          vm.newPromo = {};

          if (!hideNotification) {
            notificationsService.success('SUCCESS', 'Promo saved');
          }

          // changes in the overlay will pollute the content form
          $scope.contentForm.$pristine = true;
          $scope.contentForm.$dirty = false;
        });
    }

    /**
     * 
     * @param {} $event 
     * @param {} i 
     * @returns {} 
     */
    function disable($event, i) {
      $event.preventDefault();

      vm.promos[i].disabled = !vm.promos[i].disabled;
      save(true);
    }

    /**
     * 
     * @param {} $event 
     * @param {} i 
     * @returns {} 
     */
    function remove($event, i) {
      $event.preventDefault();

      if (confirm('Are you sure?')) {
        vm.promos.splice(i, 1);
        save();
      }
    }

    /**
     * 
     * @param {} $event 
     * @param {} index 
     * @returns {} 
     */
    function edit($event, index) {
      $event.preventDefault();

      vm.newPromo = { };
      vm.overlay = {
        view: '../app_plugins/promote/backoffice/views/edit.html',
        show: true,
        title: index !== undefined ? 'Edit module' : 'Add module',
        promos: vm.promos,
        promo: index !== undefined ? vm.promos[index] : {},
        submit: function (model) {
          vm.overlay.show = false;
          vm.overlay = null;

          if (index !== undefined) {
            model.promo.markup = generateMarkup(model.promo);
            vm.promos[index] = model.promo;
          } else {
            vm.newPromo = model.promo;
          }
          save();
        },
        close: function () {
          vm.overlay.show = false;
          vm.overlay = null; 
        }
      };
    }

    /**
     * Generat the HTML for the promo module
     * @param {} $event 
     * @returns {} 
     */
    function generateMarkup(p) {
      var str = 
      '<div style="font-size:0" class="promote-item promote-item--' + p.name.toLowerCase().replace(' ', '') + '">\r\n' +
      '  <a href="' + p.link.url + (p.querystring || '') + '">\r\n' +
      '    <img src="' + p.imageSrc + '" alt="" />\r\n' +
      '  </a>\r\n' +
      '  <style>' + p.additionalCss + '</style>' +
      (p.additionalJs ? '  <script>' + p.additionalJs + '</script>' : '') +
      '</div>';
      
      return str;
    }

    /**
     * The public API
     */
    angular.extend(vm, {
      edit: edit,
      disable: disable,
      remove: remove
    });

  }

  angular.module('umbraco').controller('promote.dashboard.controller', ['$scope', 'notificationsService', 'promoteService', ctrl]);

}());