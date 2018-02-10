using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace forCrowd.Backbone.BusinessObjects.Entities
{
    public class Project : BaseEntity
    {
        public Project()
        {
            ElementSet = new HashSet<Element>();
        }

        private string _key = string.Empty;

        public int Id { get; set; }

        [Index("UX_Project_UserId_Key", 1, IsUnique = true)]
        public int UserId { get; set; }

        [Required]
        [StringLength(50)]
        public string Name { get; set; }

        [Required]
        [StringLength(250)]
        [Index("UX_Project_UserId_Key", 2, IsUnique = true)]
        public string Key
        {
            get => _key;
            set => _key = value.Replace(" ", "-");
        }

        [Required]
        [StringLength(500)]
        public string Origin { get; set; }

        [StringLength(5000)]
        public string Description { get; set; }

        public int RatingCount { get; set; }

        public virtual User User { get; set; }
        public virtual ICollection<Element> ElementSet { get; set; }
    }
}
