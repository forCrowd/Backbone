using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace forCrowd.Backbone.BusinessObjects.Entities
{
    public class Project : BaseEntity
    {
        public Project()
        {
            ElementSet = new HashSet<Element>();
        }

        public int Id { get; set; }

        public int UserId { get; set; }

        [Required]
        [StringLength(50)]
        public string Name { get => name; set => name = value.Trim(); }

        [Required]
        [StringLength(500)]
        public string Origin { get => origin; set => origin = value.Trim(); }

        [StringLength(5000)]
        public string Description { get => description; set => description = value?.Trim(); }

        public int RatingCount { get; set; }

        public virtual User User { get; set; }
        public virtual ICollection<Element> ElementSet { get; set; }

        string name;
        string origin;
        string description;
    }
}
