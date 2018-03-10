using forCrowd.Backbone.BusinessObjects.Entities;

namespace forCrowd.Backbone.DataObjects.Migrations
{
    using DataObjects;
    using Framework;
    using Microsoft.AspNet.Identity;
    using Microsoft.AspNet.Identity.EntityFramework;
    using System;

    public static class V_0_1_2_Updates
    {
        public static void Apply(BackboneContext context)
        {
            // Create roles
            CreateRoles(context);

            // Create admin user
            CreateAdminUser(context);

            // Create sample user
            CreateSampleUser(context);
        }

        private static void CreateAdminUser(BackboneContext context)
        {
            // Manager & store
            var userStore = new AppUserStore(context);
            var userManager = new UserManager<User, int>(userStore);

            // Admin user
            var adminUserName = "admin";
            var adminEmail = "admin.backbone@forcrowd.org";
            var adminUser = new User(adminUserName, adminEmail)
            {
                EmailConfirmed = true,
                EmailConfirmationSentOn = DateTime.UtcNow,
                HasPassword = true
            };
            var adminUserPassword = DateTime.Now.ToString("yyyyMMdd");
            HandleResult(userManager.Create(adminUser, adminUserPassword));
            context.SaveChanges();

            // Add to "admin" role
            HandleResult(userManager.AddToRole(adminUser.Id, "Administrator"));
            context.SaveChanges();
        }

        private static void CreateRoles(BackboneContext context)
        {
            // Manager & store
            var roleStore = new RoleStore<Role, int, UserRole>(context);
            var roleManager = new RoleManager<Role, int>(roleStore);

            // Guest role
            var guestRole = new Role { Name = "Guest" };
            HandleResult(roleManager.Create(guestRole));

            // Regular role
            var regularRole = new Role { Name = "Regular" };
            HandleResult(roleManager.Create(regularRole));

            // Admin role
            var adminRole = new Role { Name = "Administrator" };
            HandleResult(roleManager.Create(adminRole));

            // Save
            context.SaveChanges();
        }

        private static void CreateSampleUser(BackboneContext context)
        {
            // Managers & stores & repositories
            var userStore = new AppUserStore(context);
            var userManager = new UserManager<User, int>(userStore);

            // Sample user
            var sampleUserName = "sample";
            var sampleEmail = "sample.backbone@forcrowd.org";
            var sampleUser = new User(sampleUserName, sampleEmail)
            {
                EmailConfirmed = true,
                EmailConfirmationSentOn = DateTime.UtcNow,
                HasPassword = true
            };
            var sampleUserPassword = DateTime.Now.ToString("yyyyMMdd");
            HandleResult(userManager.Create(sampleUser, sampleUserPassword));

            context.SaveChanges();

            // Add to regular role
            HandleResult(userManager.AddToRole(sampleUser.Id, "Regular"));

            context.SaveChanges();

            // Login as (required in order to save the rest of the items)
            Security.LoginAs(sampleUser.Id, "Regular");

            // First save
            context.SaveChanges();
        }

        private static void HandleResult(IdentityResult result)
        {
            if (!result.Succeeded)
            {
                var errorMessages = string.Join(" - ", result.Errors);
                throw new Exception(errorMessages);
            }
        }
    }
}
