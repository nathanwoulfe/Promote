using System;
using Promote.Models;
using System.Collections.Generic;

namespace Promote.Services
{
    public interface IPromoService
    {
        /// <summary>
        /// Gets the promos from the database for backoffice use
        /// </summary>
        /// <returns></returns>
        IEnumerable<object> GetPromos();

        /// <summary>
        /// Gets the valid promos matching the node id or content type for display on the front end
        /// </summary>
        /// <param name="nodeId">The id of the current page request</param>
        /// <param name="contentTypeAlias">The content type alias for the current page request</param>
        /// <returns></returns>
        List<PromoModel> GetValidPromos(int nodeId, string contentTypeAlias = null);

        /// <summary>
        /// Get the pair for an a-b module
        /// </summary>
        /// <param name="guid"></param>
        /// <returns></returns>
        PromoModel GetBForA(Guid guid);

        /// <summary>
        /// Save the modules - destructive method which overwrites all modules
        /// </summary>
        /// <param name="model"></param>
        void SavePromos(IEnumerable<PromoModel> model);

        /// <summary>
        /// Pushes all modules into cache for front-end display
        /// </summary>
        /// <param name="model"></param>
        void UpdateCache(IEnumerable<PromoModel> model = null);
    }
}
