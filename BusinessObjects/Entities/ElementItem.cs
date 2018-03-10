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
        public string Name { get => name; set => name = value.Trim(); }

        public Element Element { get; set; }
        public ICollection<ElementCell> ElementCellSet { get; set; }
        [InverseProperty("SelectedElementItem")]
        public ICollection<ElementCell> ParentCellSet { get; set; }

        string name;
    }
}
