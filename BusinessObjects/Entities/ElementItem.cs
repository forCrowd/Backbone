using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;

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

        public ElementCell AddCell(ElementField field)
        {
            Framework.Validations.ArgumentNullOrDefault(field, nameof(field));

            if (ElementCellSet.Any(item => item.ElementField == field))
                throw new System.Exception("An element item can't have more than one cell for the same field.");

            var cell = new ElementCell
            {
                ElementField = field,
                ElementItem = this
            };
            field.ElementCellSet.Add(cell);
            ElementCellSet.Add(cell);
            return cell;
        }
    }
}
