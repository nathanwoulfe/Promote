using Promote.Models;
using System.Collections.Generic;

namespace Promote.Repositories
{
    public interface IPocoRepository
    {
        IEnumerable<object> GetPromos();
        IEnumerable<PromoModel> GetPromoModels();

        void SavePromos(IEnumerable<PromoModel> model);

    }
}
