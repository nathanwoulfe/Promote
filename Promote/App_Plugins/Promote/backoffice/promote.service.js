(function () {
    'use strict';

    function promoteService($http, umbRequestHelper) {

        var urlBase = '/umbraco/backoffice/api/promos/';

        function request(method, url, data) {
            return umbRequestHelper.resourcePromise(
                method === 'GET' ?
                    $http.get(url) :
                    $http.post(url, data),
                'Something broke'
            );
        }

        const service = {

            getPromos: () => request('GET', urlBase + 'getpromos'),

            savePromos: promos => request('POST', urlBase + 'savepromos', promos),

            getGuid: () => {
                function p8(s) {
                    const p = (Math.random().toString(16) + '000000000').substr(2, 8);
                    return s ? `-${p.substr(0, 4)}-${p.substr(4, 4)}` : p;
                }
                return p8() + p8(true) + p8(true) + p8();
            },

            isGuid: g => g !== '00000000-0000-0000-0000-000000000000',

            generateMarkup: p => {
                return `<div style="font-size:0" class="promote-item promote-item--${p.name.toLowerCase().replace(' ', '')}">
                        <a href="${p.link.url}${p.querystring || ''}">
                            <img src="${p.imageSrc}" alt="" />
                        </a>
                        <style>${p.additionalCss}</style>
                        ${p.additionalJs ? `<script>${p.additionalJs}</script>` : ''}
                    </div>`;
            }
        };

        return service;

    }

    angular.module('umbraco').service('promoteService', ['$http', 'umbRequestHelper', promoteService]);

}());