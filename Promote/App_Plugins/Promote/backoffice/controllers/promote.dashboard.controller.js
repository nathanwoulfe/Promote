(function () {
    'use strict';

    function ctrl($q, $scope, entityResource, contentResource, notificationsService, promoteService) {

        var vm = this;

        /**
         * Fetch the existing promo modules
         */
        promoteService.getPromos()
            .then(resp => {
                this.promos = resp.data || [];
            });

        const closeOverlay = () => {
            this.overlay.show = false;
            this.overlay = null;
        }

        /**
         * Save the new promo
         * @param {} $event 
         * @returns {} 
         */
        const save = hideNotification => {
            promoteService.savePromos(this.promos)
                .then(() => {
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
        this.disable = ($event, i) => {
            $event.preventDefault();

            this.promos[i].disabled = !this.promos[i].disabled;
            save(true);
        }

        /**
         * 
         * @param {} $event 
         * @param {} i 
         * @returns {} 
         */
        this.remove = ($event, i) => {
            $event.preventDefault();

            if (confirm('Are you sure?')) {
                this.promos.splice(i, 1);
                save();
            }
        }

        /**
         * 
         * @param {} $event 
         * @param {} index 
         * @returns {} 
         */
        this.edit = ($event, index) => {
            $event.preventDefault();

            this.overlay = {
                view: '../app_plugins/promote/backoffice/views/edit.html',
                show: true,
                title: index !== undefined ? 'Edit module' : 'Add module',
                promos: this.promos,
                promo: index !== undefined ? this.promos[index] : {},
                submit: model => {
                    closeOverlay();

                    const mediaQuery = entityResource.getById(model.mediaPicker.value, 'Media');
                    const linkQuery = contentResource.getById(model.link.value);

                    model.promo.nodeId = model.displayOn.value.toString();
                    model.promo.imageId = model.mediaPicker.value.toString();
                    model.promo.linkId = model.link.value.toString();

                    $q.all([mediaQuery, linkQuery])
                        .then(resp => {
                            const mediaResponse = resp[0];
                            const linkResponse = resp[1];

                            model.promo.contentType = linkResponse.contentTypeAlias;
                            model.promo.linkUrl = linkResponse.urls[0];

                            model.promo.imageSrc = mediaResponse.metaData.umbracoFile.Value;

                            if (index !== undefined) {
                                model.promo.markup = promoteService.generateMarkup(model.promo);
                                this.promos[index] = model.promo;
                            } else {
                                this.promos.push(model.promo);
                            }

                            save();
                        });
                },
                close: () => {
                    closeOverlay();
                }
            };
        }

        this.hasAb = p => promoteService.isGuid(p.ab);

        this.abPair = guid => {
            const pair = this.promos.filter(p => p.guid === guid)[0];
            return pair ? pair.name : null;
        }
    }

    angular.module('umbraco').controller('promote.dashboard.controller', ['$q', '$scope', 'entityResource', 'contentResource', 'notificationsService', 'promoteService', ctrl]);

}());