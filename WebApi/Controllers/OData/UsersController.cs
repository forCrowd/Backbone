namespace forCrowd.Backbone.WebApi.Controllers.OData
{
    using BusinessObjects.Entities;
    using Facade;
    using DataObjects;
    using Microsoft.AspNet.Identity;
    using System.Linq;
    using System.Web.Http;

    public class UsersController : BaseODataController
    {
        public UsersController()
        {
            var dbContext = new BackboneContext();
            var appUserStore = new AppUserStore(dbContext);
            var appRoleStore = new AppRoleStore(dbContext);
            _userManager = new AppUserManager(appUserStore, appRoleStore);
        }

        private readonly AppUserManager _userManager;

        // GET odata/Users
        [AllowAnonymous]
        public IQueryable<User> Get()
        {
            var query = _userManager.GetUserSet();

            // Don't return user details to other users
            // TODO This is a bit hacky, find a better way! / coni2k - 08 Dec. '18
            var currentUserId = User.Identity.GetUserId<int>();
            foreach (var item in query.Where(item => item.Id != currentUserId))
            {
                item.ResetValues();
            }

            return query;
        }
    }
}
