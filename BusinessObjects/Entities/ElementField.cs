using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace forCrowd.Backbone.BusinessObjects.Entities
{
    public enum ElementFieldDataType : byte
    {
        /// <summary>
        /// A field that holds string value.
        /// Use StringValue property to set its value on ElementItem level.
        /// </summary>
        String = 1,

        /// <summary>
        /// A field that holds decimal value.
        /// Use DecimalValue property to set its value on ElementItem level.
        /// </summary>
        Decimal = 4,

        /// <summary>
        /// A field that holds another defined Element object within the project.
        /// Use SelectedElementItem property to set its value on ElementItem level.
        /// </summary>
        Element = 6,
    }

    public class ElementField : BaseEntity
    {
        public ElementField()
        {
            ElementCellSet = new HashSet<ElementCell>();
            UserElementFieldSet = new HashSet<UserElementField>();
        }

        public int Id { get; set; }

        public int ElementId { get; set; }

        [Required]
        [StringLength(50)]
        public string Name { get => name; set => name = value.Trim(); }

        // Can't use Enum itself, OData v3 doesn't allow it:
        // System.Runtime.Serialization.SerializationException 'forCrowd.Backbone.BusinessObjects.ElementFieldDataType' cannot be serialized using the ODataMediaTypeFormatter.
        // coni2k - 02 Jul. '17
        [Required]
        public byte DataType { get; set; }

        public int? SelectedElementId { get; set; }

        /// <summary>
        /// Determines whether this field will use a fixed value from the project owner or it will have user rateable values
        /// </summary>
        public bool UseFixedValue { get; set; }

        public bool RatingEnabled { get; set; }

        public byte SortOrder { get; set; }

        public decimal RatingTotal { get; set; }
        public int RatingCount { get; set; }

        public Element Element { get; set; }
        public Element SelectedElement { get; set; }
        public ICollection<ElementCell> ElementCellSet { get; set; }
        public ICollection<UserElementField> UserElementFieldSet { get; set; }

        string name;

        public void AddUserRating(decimal rating)
        {
            // TODO Validation?

            var userRating = new UserElementField
            {
                ElementField = this,
                Rating = rating
            };
            UserElementFieldSet.Add(userRating);
        }

        public ElementField EnableIndex()
        {
            if (DataType == (byte)ElementFieldDataType.String
                || DataType == (byte)ElementFieldDataType.String
                || DataType == (byte)ElementFieldDataType.String)
            {
                throw new System.InvalidOperationException($"Index cannot be enabled for this type: {DataType}");
            }

            RatingEnabled = true;

            RatingTotal = 50; // Computed field
            RatingCount = 1; // Computed field

            AddUserRating(50);

            return this;
        }
    }
}
