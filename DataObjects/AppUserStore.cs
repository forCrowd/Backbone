using forCrowd.Backbone.BusinessObjects.Entities;

namespace forCrowd.Backbone.DataObjects
{
    using Microsoft.AspNet.Identity.EntityFramework;

    public class AppUserStore : UserStore<User, Role, int, UserLogin, UserRole, UserClaim>
    {
        public AppUserStore(BackboneContext context) : base(context)
        {
            AutoSaveChanges = false;
        }
    }
}
