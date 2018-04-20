using System;
using System.Collections.Generic;
using System.Net;
using System.Web.Http;
using Promote.Models;
using Promote.Services;
using Umbraco.Web.WebApi;

namespace Promote.Api
{
    // /umbraco/backoffice/api/promote/promos
    public class PromosController : UmbracoAuthorizedApiController
    {
        private readonly IPromoService _promoService;

        public PromosController()
        {
            _promoService = new PromoService();
        }

        /// <summary>
        /// Get Promote object
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        public IHttpActionResult GetPromos()
        {
            try
            {
                return Ok(new
                {
                    status = HttpStatusCode.OK,
                    data = _promoService.GetPromos()
                });
            }
            catch (Exception ex)
            {
                return Ok(new
                {
                    status = HttpStatusCode.InternalServerError,
                    data = ex.Message
                });
            }
        }

        /// <summary>
        /// Save Promote settings object - manages save and delete
        /// </summary>
        /// <returns></returns>
        [HttpPost]
        public IHttpActionResult SavePromos(List<PromoModel> promos)
        {
            try
            {
                _promoService.SavePromos(promos);

                return Ok(new
                {
                    status = HttpStatusCode.OK
                });
            }
            catch (Exception ex)
            {
                return Ok(new
                {
                    status = HttpStatusCode.InternalServerError,
                    data = ex.Message
                });
            }
        }
    }
}
