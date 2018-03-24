using System.Collections.Generic;
using System.IO;
using System.Web;
using Newtonsoft.Json;
using Promote.Models;

namespace Promote.Helpers
{
    public class PromosHelper
    {
        private const string PromosFilePath = "~/App_Plugins/Promote/promos.json";

        /// <summary>
        /// Load the Promote settings from the JSON file in app_plugins
        /// </summary>
        public static List<PromoModel> GetPromos()
        {
            List<PromoModel> promos;

            using (var file = new StreamReader(HttpContext.Current.Server.MapPath(PromosFilePath)))
            {
                var json = file.ReadToEnd();
                promos = JsonConvert.DeserializeObject<List<PromoModel>>(json);
            }

            return promos;
        }

        /// <summary>
        /// Save the Promote settings to the JSON file in app_plugins
        /// </summary>
        public static bool SavePromos(List<PromoModel> promos)
        {
            try
            {
                using (var file = new StreamWriter(HttpContext.Current.Server.MapPath(PromosFilePath), false))
                {
                    var serializer = new JsonSerializer();
                    serializer.Serialize(file, promos);
                }
                return true;
            }
            catch
            {
                return false;
            }
        }
    }
}
