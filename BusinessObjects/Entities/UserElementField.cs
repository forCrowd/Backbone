using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace forCrowd.Backbone.BusinessObjects.Entities
{
    [UserAware("UserId")]
    public class UserElementField : BaseEntity
    {
        [Key]
        [Column(Order = 1)]
        public int UserId { get; set; }

        [Key]
        [Column(Order = 2)]
        public int ElementFieldId { get; set; }

        public decimal Rating { get; set; }

        public virtual User User { get; set; }
        public virtual ElementField ElementField { get; set; }
    }
}
