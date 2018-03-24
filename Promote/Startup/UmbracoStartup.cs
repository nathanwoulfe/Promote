using System.Configuration;
using System.Web.Configuration;
using System.Web.Mvc;
using Promote.Helpers;
using umbraco.cms.businesslogic.packager;
using Umbraco.Core;
using Promote.Filters;
using Installer = Promote.Helpers.Installer;

namespace Promote.Startup
{
    public class UmbracoStartup : ApplicationEventHandler
    {
        private const string AppSettingKey = "PromoteInstalled";

        protected override void ApplicationStarted(UmbracoApplicationBase umbracoApplication, ApplicationContext context)
        {
            //Check to see if appSetting PromoteInstalled is true or even present
            string installAppSetting = WebConfigurationManager.AppSettings[AppSettingKey];

            if (string.IsNullOrEmpty(installAppSetting) || installAppSetting != true.ToString())
            {
                //Add Content dashboard XML
                Installer.AddSectionDashboard();

                //All done installing our custom stuff
                //As we only want this to run once - not every startup of Umbraco
                Configuration webConfig = WebConfigurationManager.OpenWebConfiguration("/");
                webConfig.AppSettings.Settings.Add(AppSettingKey, true.ToString());
                webConfig.Save();
            }

            GlobalFilters.Filters.Add(new PromoteFilterAttribute());

            //Add OLD Style Package Event
            InstalledPackage.BeforeDelete += InstalledPackage_BeforeDelete;
        }

        /// <summary>
        /// Uninstall Package - Before Delete (Old style events, no V6/V7 equivelant)
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        private static void InstalledPackage_BeforeDelete(InstalledPackage sender, System.EventArgs e)
        {
            //Check which package is being uninstalled
            if (sender.Data.Name != "Promote") return;

            //Start Uninstall - clean up process...
            Uninstaller.RemoveSectionDashboard();

            //Remove AppSetting key when all done
            Configuration webConfig = WebConfigurationManager.OpenWebConfiguration("/");
            webConfig.AppSettings.Settings.Remove(AppSettingKey);
            webConfig.Save();
        }
    }
}
