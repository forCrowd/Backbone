using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using forCrowd.Backbone.Framework;

namespace forCrowd.Backbone.BusinessObjects.Entities
{
    public class Element : BaseEntity
    {
        public Element()
        {
            ElementFieldSet = new HashSet<ElementField>();
            ElementItemSet = new HashSet<ElementItem>();
            ParentFieldSet = new HashSet<ElementField>();
        }

        public Element(Project project, string name)
            : this()
        {
            Validations.ArgumentNullOrDefault(project, nameof(project));
            Validations.ArgumentNullOrDefault(name, nameof(name));

            Project = project;
            Name = name;
        }

        public int Id { get; set; }

        public int ProjectId { get; set; }

        [Required]
        [StringLength(50)]
        public string Name { get => name; set => name = value.Trim(); }

        public Project Project { get; set; }

        public ICollection<ElementField> ElementFieldSet { get; set; }
        public ICollection<ElementItem> ElementItemSet { get; set; }
        [InverseProperty("SelectedElement")]
        public ICollection<ElementField> ParentFieldSet { get; set; }

        string name;

        public ElementField AddField(string name, ElementFieldDataType fieldType, bool useFixedValue = true)
        {
            // TODO Validation - Same name?
            var sortOrder = Convert.ToByte(ElementFieldSet.Count + 1);
            var field = new ElementField
            {
                Element = this,
                Name = name,
                DataType = (byte)fieldType,
                SortOrder = sortOrder,
                UseFixedValue = useFixedValue
            };

            ElementFieldSet.Add(field);
            return field;
        }

        public ElementItem AddItem(string name)
        {
            // TODO Validation - Same name?
            var item = new ElementItem
            {
                Element = this,
                Name = name
            };
            ElementItemSet.Add(item);
            return item;
        }
    }
}
