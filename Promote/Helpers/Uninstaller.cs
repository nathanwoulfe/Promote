using System.Web.Hosting;
using System.Xml;

namespace Promote.Helpers
{
    public static class Uninstaller
    {
        
        /// <summary>
        /// Removes the XML for the Section Dashboard from the XML file
        /// </summary>
        public static void RemoveSectionDashboard()
        {
            var saveFile = false;

            //Open up language file
            //umbraco/config/lang/en.xml
            const string dashboardPath = "~/config/dashboard.config";

            //Path to the file resolved
            string dashboardFilePath = HostingEnvironment.MapPath(dashboardPath);

            //Load settings.config XML file
            var dashboardXml = new XmlDocument();
            dashboardXml.Load(dashboardFilePath ?? "");

            // Dashboard Root Node
            // <dashboard>
            XmlNode dashboardNode = dashboardXml.SelectSingleNode("//dashBoard");
            XmlNode contentTab = dashboardNode?.SelectSingleNode("//tab[@caption='Promote']");

            if (contentTab != null)
            {
                contentTab.ParentNode?.RemoveChild(contentTab);
                saveFile = true;
            }

            //If saveFile flag is true then save the file
            if (!saveFile) return;
            
            //Save the XML file
            if (!string.IsNullOrEmpty(dashboardFilePath))
            {
                dashboardXml.Save(dashboardFilePath);
            }
        }
    }
}