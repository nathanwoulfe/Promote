using Promote.Models;
using Umbraco.Core;
using Umbraco.Core.Logging;
using Umbraco.Core.Persistence;

namespace Promote.Startup
{
    public class RegisterDatabaseTable : ApplicationEventHandler
    {
        protected override void ApplicationStarted(UmbracoApplicationBase umbracoApplication, ApplicationContext applicationContext)
        {
            var dbContext = applicationContext.DatabaseContext;
            var helper = new DatabaseSchemaHelper(dbContext.Database, LoggerResolver.Current.Logger, dbContext.SqlSyntax);

            if (helper.TableExist("PromoteModules")) return;

            helper.CreateTable<PromoPoco>(false);
        }
    }
}
