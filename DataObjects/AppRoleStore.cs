using forCrowd.Backbone.BusinessObjects.Entities;

namespace forCrowd.Backbone.DataObjects
{
    using Microsoft.AspNet.Identity.EntityFramework;

    public class AppRoleStore : RoleStore<Role, int, UserRole>
    {
        public AppRoleStore(BackboneContext context) : base(context)
        {
        }
    }
}
