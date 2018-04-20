/*! promote - v1.0.0-build1 - 2018-03-25
 * Copyright (c) 2018 Nathan Woulfe;
 * Licensed MIT
 */

(function () {
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
(function () {
    'use strict';

    function ctrl($scope, contentResource, mediaResource, promoteService) {

        var vm = this;
        var cssClass = '.promote-item--';

        if (!$scope.model.promo.guid) {
            $scope.model.promo.guid = promoteService.getGuid();
        }

        if (!$scope.model.promo.image && $scope.model.promo.imageId) {
            mediaResource.getById($scope.model.promo.imageId)
                .then(function (resp) {
                    $scope.model.promo.image = resp;
                    $scope.model.promo.imageSrc = resp.mediaLink;
                });
        }

        if (!$scope.model.promo.link && $scope.model.promo.linkId) {
            contentResource.getById($scope.model.promo.linkId)
                .then(function (resp) {
                    $scope.model.promo.link = resp;
                    getUrlForLink();
                });
        }

        if ($scope.model.promo.nodeId) {
            contentResource.getById($scope.model.promo.nodeId)
                .then(function (resp) {
                    $scope.model.promo.node = resp;
                    $scope.model.promo.contentTypeAlias = resp.contentTypeAlias;
                });
        }

        // check if promo is in the b in an a-b
        var inAb = $scope.model.promos.filter(function (v) {
            return v.ab === $scope.model.promo.guid;
        });

        if (inAb) {
            vm.ab = inAb[0];
        }

        /**
         * build default classes for additional css property
         */
        $scope.$watch('model.promo.name', function (newVal, oldVal) {
            if (newVal && newVal !== oldVal) {
                var className = cssClass + newVal.toLowerCase().replace(' ', '');

                // update css if name changes, set if new
                if ($scope.model.promo.additionalCss) {
                    var oldClassName = cssClass + oldVal.toLowerCase().replace(' ', '');
                    var regex = new RegExp(oldClassName, 'g');

                    $scope.model.promo.additionalCss =
                        $scope.model.promo.additionalCss.replace(regex, className);
                } else {
                    var str =
                        className + ' { }\r\n' +
                        className + ' a { }\r\n' +
                        className + ' img { max-width:100%; height:auto; }';

                    $scope.model.promo.additionalCss = str;
                }
            }
        });

        /**
         * Get the URL of the selected link target
         * @returns {} 
         */
        function getUrlForLink() {
            contentResource.getNiceUrl($scope.model.promo.link.id)
                .then(function (resp) {
                    $scope.model.promo.link.url = resp;
                });
        }

        /**
         * Simple filter for A-B select element, to prevent A-B testing with self
         * @param {} o 
         * @returns {} 
         */
        function excludeCurrentPromo(o) {
            return o.guid !== $scope.model.promo.guid;
        }


        // OVERLAYS //

        function closeOverlay() {
            vm.overlay.show = false;
            vm.overlay = null;
        }

        /**
        * 
        * @param {} $event 
        * @returns {} 
        */
        function setImage($event) {
            $event.preventDefault();

            vm.overlay = {
                view: 'mediapicker',
                show: true,
                multiPicker: false,
                submit: function (model) {
                    $scope.model.promo.image = model.selectedImages[0];
                    $scope.model.promo.imageSrc = model.selectedImages[0].file;
                    closeOverlay();
                },
                close: function () {
                    closeOverlay();
                }
            };
        }

        /**
         * 
         * @param {} $event 
         * @returns {} 
         */
        function setLink($event) {
            $event.preventDefault();

            vm.overlay = {
                view: 'contentpicker',
                show: true,
                multiPicker: false,
                submit: function (resp) {
                    $scope.model.promo.link = resp.selection[0];
                    getUrlForLink();
                    closeOverlay();
                },
                close: function () {
                    closeOverlay();
                }
            };
        }

        /**
         * 
         * @param {} $event 
         * @returns {} 
         */
        function setNode($event) {
            $event.preventDefault();

            vm.overlay = {
                view: 'contentpicker',
                show: true,
                multiPicker: false,
                submit: function (resp) {
                    $scope.model.promo.node = resp.selection[0];
                    $scope.model.promo.nodeId = resp.selection[0].id;
                    $scope.model.promo.contentTypeAlias = resp.selection[0].metaData.ContentTypeAlias;
                    $scope.model.promo.applyTo = 'this';

                    closeOverlay();
                },
                close: function () {
                    closeOverlay();
                }
            };
        }

        /**
         * The public API
         */
        angular.extend(vm, {
            setImage: setImage,
            setLink: setLink,
            setNode: setNode,
            excludeCurrentPromo: excludeCurrentPromo
        });

    }

    angular.module('umbraco').controller('promote.edit.controller', ['$scope', 'contentResource', 'mediaResource', 'promoteService', ctrl]);

}());
(function () {
    'use strict';

    function promoteService($http, umbRequestHelper) {

        var urlBase = '/umbraco/backoffice/api/promos/';

        var service = {
            request: function (method, url, data) {
                return umbRequestHelper.resourcePromise(
                    method === 'GET' ?
                        $http.get(url) :
                        $http.post(url, data),
                    'Something broke'
                );
            },

            getPromos: function () {
                return this.request('GET', urlBase + 'getpromos');
            },

            savePromos: function (promos) {
                return this.request('POST', urlBase + 'savepromos', promos);
            },

            getGuid: function() {
                function p8(s) {
                    var p = (Math.random().toString(16) + '000000000').substr(2, 8);
                    return s ? `-${p.substr(0, 4)}-${p.substr(4, 4)}` : p;
                }
                return p8() + p8(true) + p8(true) + p8();
            }
        };

        return service;

    }

    angular.module('umbraco').service('promoteService', ['$http', 'umbRequestHelper', promoteService]);

}());