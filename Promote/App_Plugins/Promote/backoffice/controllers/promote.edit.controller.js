(function () {
    'use strict';

    function ctrl($scope, contentResource, mediaResource, promoteService) {

        const cssBase = '.promote-item--';

        $scope.model.mediaPicker = {
            label: 'Image',
            alias: 'image',
            editor: 'Umbraco.MediaPicker',
            view: 'mediapicker',
            value: $scope.model.promo.imageId ? $scope.model.promo.imageId.toString() : '',
            config: {
                idType: 'int',
                multiPicker: '0',
                onlyImages: '1'
            }
        };

        $scope.model.displayOn = {
            label: 'Display on',
            alias: 'displayOn',
            editor: 'Umbraco.ContentPicker',
            view: 'contentpicker',
            value: $scope.model.promo.nodeId ? $scope.model.promo.nodeId.toString() : '',
            config: {
                multiPicker: '0',
                maxNumber: 1
            }
        };

        $scope.model.link = {
            label: 'Link',
            alias: 'link',
            editor: 'Umbraco.ContentPicker',
            view: 'contentpicker',
            value: $scope.model.promo.linkId ? $scope.model.promo.linkId.toString() : '',
            config: {
                multiPicker: '0',
                maxNumber: 1
            }
        };

        if (!$scope.model.promo.guid) {
            $scope.model.promo.guid = promoteService.getGuid();
        }

        // check if promo is in the b in an a-b
        const inAb = $scope.model.promos.filter(v => v.ab === $scope.model.promo.guid);

        if (inAb) {
            this.ab = inAb[0];
        }

        /**
         * build default classes for additional css property
         */
        $scope.$watch('model.promo.name', (newVal, oldVal) => {
            if (newVal && newVal !== oldVal) {
                const className = cssBase + newVal.toLowerCase().replace(' ', '');

                // update css if name changes, set if new
                if ($scope.model.promo.additionalCss) {
                    const oldClassName = cssBase + oldVal.toLowerCase().replace(' ', '');
                    const regex = new RegExp(oldClassName, 'g');

                    $scope.model.promo.additionalCss = $scope.model.promo.additionalCss.replace(regex, className);
                } else {
                    $scope.model.promo.additionalCss = `${className} { }\r\n${className} a { }\r\n${className} img { max-width:100%; height:auto; }`;
                }
            }
        });

        /**
         * Simple filter for A-B select element, to prevent A-B testing with self
         * @param {} o 
         * @returns {} 
         */
        this.excludeCurrentPromo = o => o.guid !== $scope.model.promo.guid;

    }

    angular.module('umbraco').controller('promote.edit.controller', ['$scope', 'contentResource', 'mediaResource', 'promoteService', ctrl]);

}());