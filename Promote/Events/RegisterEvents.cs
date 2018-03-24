using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Caching;
using System.Text;
using System.Threading.Tasks;
using Promote.Models;
using Promote.Services;
using Umbraco.Core;

namespace Promote.Events
{
    public class RegisterEvents : ApplicationEventHandler
    {
        private readonly IPromoService _promoService;

        public RegisterEvents()
        {
            _promoService = new PromoService();
        }

        protected override void ApplicationStarted(UmbracoApplicationBase umbracoApplication,
            ApplicationContext applicationContext)
        {
            _promoService.UpdateCache();
        }
    }
}
