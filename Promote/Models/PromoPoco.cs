using Umbraco.Core.Persistence;
using Umbraco.Core.Persistence.DatabaseAnnotations;

namespace Promote.Models
{
    [TableName("PromoteModules")]
    [ExplicitColumns]
    [PrimaryKey("Id", autoIncrement = true)]
    public class PromoPoco
    {
        [Column("Id")]
        [PrimaryKeyColumn(AutoIncrement = true)]
        public int Id { get; set; }

        [Column("Promo")]
        [SpecialDbType(SpecialDbTypes.NTEXT)]
        public string Promo { get; set; }
    }
}
