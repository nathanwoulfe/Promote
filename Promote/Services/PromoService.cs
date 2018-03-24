using Promote.Models;
using Promote.Repositories;
using System.Collections.Generic;

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
        public IEnumerable<PromoModel> GetPromoModels()
        {
            return _repo.GetPromoModels();
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="model"></param>
        public void SavePromos(IEnumerable<PromoModel> model)
        {
            _repo.SavePromos(model);
        }
    }
}
