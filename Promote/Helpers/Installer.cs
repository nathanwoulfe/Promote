using System.Web.Hosting;
using System.Xml;

namespace Promote.Helpers
{
    public static class Installer
    {
        public static void AddSectionDashboard()
        {
            var saveFile = false;
            const string dashboardPath = "~/config/dashboard.config";

            //Path to the file resolved
            string dashboardFilePath = HostingEnvironment.MapPath(dashboardPath);

            //Load settings.config XML file
            var dashboardXml = new XmlDocument();
            dashboardXml.Load(dashboardFilePath ?? "");

            XmlNode firstTab = dashboardXml.SelectSingleNode("//section [@alias='StartupDashboardSection']/areas");

            if (firstTab != null)
            {
                const string xmlToAdd = "<tab caption='Promote'>" +
                                    "<control addPanel='true' panelCaption=''>/app_plugins/promote/backoffice/views/dashboard.html</control>" +
                                "</tab>";

                //Load in the XML string above
                XmlDocumentFragment frag = dashboardXml.CreateDocumentFragment();
                frag.InnerXml = xmlToAdd;

                //Append the xml above to the dashboard node
                dashboardXml.SelectSingleNode("//section [@alias='StartupDashboardSection']")?.InsertAfter(frag, firstTab);

                //Save the file flag to true
                saveFile = true;
            }

            //If saveFile flag is true then save the file
            if (saveFile && !string.IsNullOrEmpty(dashboardFilePath))
            {
                //Save the XML file
                dashboardXml.Save(dashboardFilePath);
            }
        }        
    }
}