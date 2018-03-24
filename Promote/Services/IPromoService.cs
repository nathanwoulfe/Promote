using Promote.Models;
using System.Collections.Generic;

namespace Promote.Services
{
    public interface IPromoService
    {
        IEnumerable<object> GetPromos();
        IEnumerable<PromoModel> GetPromoModels();

        void SavePromos(IEnumerable<PromoModel> model);
    }
}
