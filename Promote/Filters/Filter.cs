using System;
using System.Collections.Generic;
using System.Linq;
using HtmlAgilityPack;
using Promote.Models;
using Promote.Services;
using Umbraco.Core.Models;
using Umbraco.Web;

namespace Promote.Filters
{
    public class PromoteFilterAttribute : OutputProcessorActionFilterAttribute
    {
        private readonly IPromoService _promoService;
        private static readonly Random Random = new Random();

        public PromoteFilterAttribute()
        {
            _promoService = new PromoService();
        }

        protected override string Process(string data)
        {
            // only act on front-end requests
            if (UmbracoContext.Current.PageId == null || !UmbracoContext.Current.IsFrontEndUmbracoRequest) return data;

            // get the current requested node
            int pageId = UmbracoContext.Current.PageId.Value;
            string contentTypeAlias = UmbracoContext.Current.PublishedContentRequest?.PublishedContent?.DocumentTypeAlias;

            IEnumerable<PromoModel> modules = _promoService.GetPromoModels(pageId, contentTypeAlias);
            if (!modules.Any()) return data;

            var doc = new HtmlDocument();
            doc.LoadHtml(data);

            HtmlNode root = doc.DocumentNode;
            HtmlNode body = root.SelectSingleNode("//body");
           
            // get the stored markup for each module and append to the document body, in an identifiable wrapper
            foreach (PromoModel module in modules)
            {
                HtmlNode promoteElm = doc.CreateElement("promote-node");
                promoteElm.SetAttributeValue("data-selector", module.Selector);
                promoteElm.SetAttributeValue("data-attach", module.Attach);
                promoteElm.SetAttributeValue("style", "display:none!important");

                var moduleDoc = new HtmlDocument();

                // manage a-b split here - if current module has an a-b match, maybe use it
                // a-b will use markup for either, but in the location of the current module, so styles/js need to work for both modules
                PromoModel[] options = {module, modules.FirstOrDefault(m => m.Guid == module.Ab) };
                moduleDoc.LoadHtml(options.Last() != null ? options[Random.Next(options.Length)].Markup : module.Markup);

                HtmlNode moduleMarkup = moduleDoc.DocumentNode;

                promoteElm.AppendChild(moduleMarkup);
                body.AppendChild(promoteElm);
            }

            // append script reference if modules exist for the page
            HtmlNode scriptNode = HtmlNode.CreateNode("<script async src=\"/app_plugins/promote/backoffice/promote.frontend.js\"></script>");
            body.AppendChild(scriptNode);

            data = root.OuterHtml;

            return data;
        }
    }
}
