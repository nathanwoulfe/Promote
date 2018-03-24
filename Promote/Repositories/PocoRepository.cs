using System.Collections.Generic;
using System.Linq;
using Newtonsoft.Json;
using Promote.Models;
using Umbraco.Core;
using Umbraco.Core.Persistence;

namespace Promote.Repositories
{
    public class PocoRepository : IPocoRepository
    {
        private readonly UmbracoDatabase _database;

        public PocoRepository()
            : this(ApplicationContext.Current.DatabaseContext.Database)
        {
        }

        private PocoRepository(UmbracoDatabase database)
        {
            _database = database;
        }

        /// <summary>
        /// Get all available promo modules as a blob for use in backoffice
        /// </summary>
        /// <returns></returns>
        public IEnumerable<object> GetPromos()
        {
            List<PromoPoco> pocos = _database.Fetch<PromoPoco>("SELECT * FROM PromoteModules");
            return pocos.Select(p => JsonConvert.DeserializeObject(p.Promo));
        }

        /// <summary>
        /// Get all available promo modules as .NET model for use in filter
        /// </summary>
        /// <returns></returns>
        public IEnumerable<PromoModel> GetPromoModels()
        {
            List<PromoPoco> pocos = _database.Fetch<PromoPoco>("SELECT * FROM PromoteModules");
            return pocos.Select(p => JsonConvert.DeserializeObject<PromoModel>(p.Promo)).ToArray();
        }

        /// <summary>
        /// Save the blob back to the database
        /// </summary>
        /// <param name="model"></param>
        public void SavePromos(IEnumerable<PromoModel> model)
        {
            _database.Execute("DELETE FROM PromoteModules");

            // stringify the json to store a simple blob
            List<PromoPoco> toSave = model.Select((p, i) => new PromoPoco
                {
                    Promo = JsonConvert.SerializeObject(p)
                }).ToList();

            foreach (PromoPoco m in toSave)
            {
                _database.Insert(m);
            }
        }
    }
}
