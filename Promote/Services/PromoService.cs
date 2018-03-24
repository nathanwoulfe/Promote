using System;
using System.Collections;
using Promote.Models;
using Promote.Repositories;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Caching;

namespace Promote.Services
{
    public class PromoService : IPromoService
    {
        private readonly IPocoRepository _repo;

        public PromoService() : this (new PocoRepository())
        {
        }

        private PromoService(IPocoRepository repo)
        {
            _repo = repo;
        }

        /// <summary>
        /// 
        /// </summary>
        /// <returns></returns>
        public IEnumerable<object> GetPromos()
        {
            return _repo.GetPromos();
        }

        /// <summary>
        /// 
        /// </summary>
        /// <returns></returns>
        public IEnumerable<PromoModel> GetPromoModels(int nodeId, string contentTypeAlias = null)
        {
            List<PromoModel> model = new List<PromoModel>();

            // valid modules are those where the node id matches this request, and applied to only this page
            // or the content type alias matches, and the module is applied to all of type
            foreach (DictionaryEntry item in HttpContext.Current.Cache)
            {
                string key = item.Key.ToString();
                if (key.StartsWith("promotemodule_") && key.Contains($"this_{nodeId}") || key.Contains($"all_{contentTypeAlias}"))
                {
                    var val = item.Value as PromoModel;
                    if (!val.Disabled)
                    {
                        model.Add(val);
                    }
                }
            }

            return model;
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="model"></param>
        public void SavePromos(IEnumerable<PromoModel> model)
        {
            _repo.SavePromos(model);
            UpdateCache(model);
        }

        /// <summary>
        /// Push all promos from database into memory
        /// </summary>
        /// <param name="model"></param>
        public void UpdateCache(IEnumerable<PromoModel> model = null)
        {
            IEnumerable<PromoModel> promos = model ?? _repo.GetPromoModels();
            if (!promos.Any()) return;

            foreach (PromoModel promo in promos)
            {
                string key = promo.ApplyTo == "this" 
                    ? $"this_{promo.NodeId}" 
                    : $"all_{promo.ContentTypeAlias}";

                HttpContext.Current.Cache[$"promotemodule_{key}_{promo.Guid}"] = promo;
            }
        }
    }
}
