using System;
using Newtonsoft.Json;

namespace Promote.Models
{
    public class PromoModel
    {
        [JsonProperty("guid")]
        public Guid Guid { get; set; }

        [JsonProperty("name")]
        public string Name { get; set; }

        [JsonProperty("applyTo")]
        public string ApplyTo { get; set; }

        [JsonProperty("additionalCss")]
        public string AdditionalCss { get; set; }

        [JsonProperty("additionalJs")]
        public string AdditionalJs { get; set; }

        [JsonProperty("selector")]
        public string Selector { get; set; }

        [JsonProperty("attach")]
        public string Attach { get; set; }

        [JsonProperty("linkId")]
        public int LinkId { get; set; }

        [JsonProperty("imageSrc")]
        public string ImageSrc { get; set; }

        [JsonProperty("imageId")]
        public int ImageId { get; set; }

        [JsonProperty("markup")]
        public string Markup { get; set; }

        [JsonProperty("contentTypeAlias")]
        public string ContentTypeAlias { get; set; }

        [JsonProperty("nodeId")]
        public int NodeId { get; set; }

        [JsonProperty("disabled")]
        public bool Disabled { get; set; }

        [JsonProperty("ab")]
        public Guid Ab { get; set; }
    }
}
