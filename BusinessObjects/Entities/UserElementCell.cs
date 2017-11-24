using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace forCrowd.Backbone.BusinessObjects.Entities
{
    [UserAware("UserId")]
    public class UserElementCell : BaseEntity
    {
        [Key]
        [Column(Order = 1)]
        public int UserId { get; set; }

        [Key]
        [Column(Order = 2)]
        public int ElementCellId { get; set; }

        public decimal? DecimalValue { get; set; }

        public virtual User User { get; set; }

        public virtual ElementCell ElementCell { get; set; }
    }
}
