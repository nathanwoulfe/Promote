using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;

namespace Promote.Helpers
{
    internal static class ViewHelpers
    {
        public static JsonSerializerSettings CamelCase => new JsonSerializerSettings
        {
            ContractResolver = new CamelCasePropertyNamesContractResolver()
        };
    }
}