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
                .then(resp => {
                    $scope.model.promo.image = resp;
                    $scope.model.promo.imageSrc = resp.mediaLink;
                });
        }

        if (!$scope.model.promo.link && $scope.model.promo.linkId) {
            contentResource.getById($scope.model.promo.linkId)
                .then(resp => {
                    $scope.model.promo.link = resp;
                    getUrlForLink();
                });
        }

        if ($scope.model.promo.nodeId) {
            contentResource.getById($scope.model.promo.nodeId)
                .then(resp => {
                    $scope.model.promo.node = resp;
                    $scope.model.promo.contentTypeAlias = resp.contentTypeAlias;
                });
        }

        // check if promo is in the b in an a-b
        const inAb = $scope.model.promos.filter(v => v.ab === $scope.model.promo.guid);

        if (inAb) {
            vm.ab = inAb[0];
        }

        /**
         * build default classes for additional css property
         */
        $scope.$watch('model.promo.name', (newVal, oldVal) => {
            if (newVal && newVal !== oldVal) {
                const className = cssClass + newVal.toLowerCase().replace(' ', '');

                // update css if name changes, set if new
                if ($scope.model.promo.additionalCss) {
                    const oldClassName = cssClass + oldVal.toLowerCase().replace(' ', '');
                    const regex = new RegExp(oldClassName, 'g');

                    $scope.model.promo.additionalCss = $scope.model.promo.additionalCss.replace(regex, className);
                } else {
                    $scope.model.promo.additionalCss = `${className} { }\r\n${className} a { }\r\n${className} img { max-width:100%; height:auto; }`;
                }
            }
        });

        /**
         * Get the URL of the selected link target
         * @returns {} 
         */
        function getUrlForLink() {
            contentResource.getNiceUrl($scope.model.promo.link.id)
                .then(resp => {
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
                submit: model => {
                    $scope.model.promo.image = model.selectedImages[0];
                    $scope.model.promo.imageSrc = model.selectedImages[0].file;
                    closeOverlay();
                },
                close: () => {
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
                submit: resp => {
                    $scope.model.promo.link = resp.selection[0];
                    getUrlForLink();
                    closeOverlay();
                },
                close: () => {
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
                submit: resp => {
                    $scope.model.promo.node = resp.selection[0];
                    $scope.model.promo.nodeId = resp.selection[0].id;
                    $scope.model.promo.contentTypeAlias = resp.selection[0].metaData.ContentTypeAlias;
                    $scope.model.promo.applyTo = 'this';

                    closeOverlay();
                },
                close: () => {
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