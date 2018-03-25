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
