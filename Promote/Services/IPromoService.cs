using Promote.Models;
using System.Collections.Generic;

namespace Promote.Services
{
    public interface IPromoService
    {
        IEnumerable<object> GetPromos();
        IEnumerable<PromoModel> GetPromoModels(int nodeId, string contentTypeAlias = null);

        void SavePromos(IEnumerable<PromoModel> model);
        void UpdateCache(IEnumerable<PromoModel> model = null);
    }
}
