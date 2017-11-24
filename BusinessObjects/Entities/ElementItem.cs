using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace forCrowd.Backbone.BusinessObjects.Entities
{
    public class ElementItem : BaseEntity
    {
        public ElementItem()
        {
            ElementCellSet = new HashSet<ElementCell>();
            ParentCellSet = new HashSet<ElementCell>();
        }

        public int Id { get; set; }

        public int ElementId { get; set; }

        [Required]
        [StringLength(150)]
        public string Name { get; set; }

        public virtual Element Element { get; set; }
        public virtual ICollection<ElementCell> ElementCellSet { get; set; }
        [InverseProperty("SelectedElementItem")]
        public virtual ICollection<ElementCell> ParentCellSet { get; set; }
    }
}
