using System;
using System.ComponentModel.DataAnnotations;
using Microsoft.AspNet.Identity.EntityFramework;

namespace forCrowd.Backbone.BusinessObjects.Entities
{
    public class Role : IdentityRole<int, UserRole>, IEntity
    {
        public new string Name { get => base.Name; set => base.Name = value.Trim(); }

        public DateTime CreatedOn { get; set; }

        public DateTime ModifiedOn { get; set; }

        public DateTime? DeletedOn { get; set; }

        [Timestamp]
        public byte[] RowVersion { get; set; }
    }
}
