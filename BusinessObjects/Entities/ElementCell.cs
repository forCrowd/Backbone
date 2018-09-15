using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;

namespace forCrowd.Backbone.BusinessObjects.Entities
{
    public class ElementCell : BaseEntity
    {
        public ElementCell()
        {
            UserElementCellSet = new HashSet<UserElementCell>();
        }

        public int Id { get; set; }

        [Index("UX_ElementCell_ElementFieldId_ElementItemId", 1, IsUnique = true)]
        public int ElementFieldId { get; set; }

        [Index("UX_ElementCell_ElementFieldId_ElementItemId", 2, IsUnique = true)]
        public int ElementItemId { get; set; }

        public string StringValue { get => stringValue; set => stringValue = value?.Trim(); }

        public decimal DecimalValueTotal { get; set; }
        public int DecimalValueCount { get; set; }

        /// <summary>
        /// In case this cell's field type is Element, this is the selected item for this cell.
        /// Other values are stored on UserElementCell, but since this one has FK, it's directly set on ElementCell.
        /// </summary>
        public int? SelectedElementItemId { get; set; }
        public ElementItem ElementItem { get; set; }
        public ElementField ElementField { get; set; }
        public ElementItem SelectedElementItem { get; set; }
        public ICollection<UserElementCell> UserElementCellSet { get; set; }
        public UserElementCell UserElementCell => UserElementCellSet.SingleOrDefault();

        string stringValue;

        public void SetValue(ElementItem value)
        {
            SetValueHelper(ElementFieldDataType.Element);
            SelectedElementItem = value;
        }

        public ElementCell SetValue(string value)
        {
            SetValueHelper(ElementFieldDataType.String);
            StringValue = value;
            return this;
        }

        private void SetValueHelper(ElementFieldDataType valueType)
        {
            // Validations

            // a. Field and value types have to match
            var fieldType = (ElementFieldDataType)ElementField.DataType;

            if (fieldType != valueType)
            {
                throw new System.InvalidOperationException(
                    $"Invalid value, field and value types don't match - Field type: {fieldType}, Value type: {valueType}");
            }

            // Clear, if FixedValue
            if (ElementField.UseFixedValue)
                ClearFixedValues();
        }

        private void ClearFixedValues()
        {
            //StringValue = null;
            //DecimalValue = null;
            // TODO Do we need to set both?
            SelectedElementItemId = null;
            SelectedElementItem = null;
        }
    }
}
