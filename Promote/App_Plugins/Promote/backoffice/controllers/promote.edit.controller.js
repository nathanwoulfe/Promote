(function () {
    'use strict';

    function ctrl($scope, contentResource, mediaResource) {

        var vm = this;
        var cssClass = '.promote-item--';

        function getGuid() {
            function p8(s) {
                var p = (Math.random().toString(16) + '000000000').substr(2, 8);
                return s ? '-' + p.substr(0, 4) + '-' + p.substr(4, 4) : p;
            }
            return p8() + p8(true) + p8(true) + p8();
        }

        if (!$scope.model.promo.guid) {
            $scope.model.promo.guid = getGuid();
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
         * Simple filter for A-B select element, to prevent A-B testing with self
         * @param {} o 
         * @returns {} 
         */
        function excludeCurrentPromo(o) {
            return o.guid !== $scope.model.promo.guid;
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
            excludeCurrentPromo
        });

    }

    angular.module('umbraco').controller('promote.edit.controller', ['$scope', 'contentResource', 'mediaResource', ctrl]);

}());