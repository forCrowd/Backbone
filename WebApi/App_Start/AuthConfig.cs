using forCrowd.Backbone.BusinessObjects.Entities;

namespace forCrowd.Backbone.WebApi
{
    using DataObjects;
    using Facade;
    using Framework;
    using Microsoft.AspNet.Identity;
    using Microsoft.AspNet.Identity.Owin;
    using Microsoft.Owin;
    using Microsoft.Owin.Security.OAuth;
    using Owin;
    using Providers;
    using System;

    public static class AuthConfig
    {
        public static string PublicClientId { get; private set; }

        // For more information on configuring authentication, please visit http://go.microsoft.com/fwlink/?LinkId=301864
        public static void ConfigureAuth(IAppBuilder app)
        {
            // Configure the db context and user manager to use a single instance per request
            // TODO Is this correct to make DbContext accessible from Web application?
            app.CreatePerOwinContext(BackboneContext.Create);
            app.CreatePerOwinContext<AppUserManager>(CreateUserManager);

            // Configure the application for OAuth based flow
            PublicClientId = "self";
            var OAuthServerOptions = new OAuthAuthorizationServerOptions
            {
                TokenEndpointPath = new PathString("/api/v1/Token"),
                Provider = new ApplicationOAuthProvider(PublicClientId),
                AccessTokenExpireTimeSpan = TimeSpan.FromHours(3),
                AllowInsecureHttp = !AppSettings.EnableSsl
            };

            // Enable the application to use bearer tokens to authenticate users
            app.UseOAuthBearerTokens(OAuthServerOptions);
        }

        public static AppUserManager CreateUserManager(IdentityFactoryOptions<AppUserManager> options, IOwinContext context)
        {
            var dbContext = context.Get<BackboneContext>();
            var appUserStore = new AppUserStore(dbContext);
            var appRoleStore = new AppRoleStore(dbContext);

            var manager = new AppUserManager(appUserStore, appRoleStore);
            // Configure validation logic for userNames
            manager.UserValidator = new UserValidator<User, int>(manager)
            {
                AllowOnlyAlphanumericUserNames = false,
                RequireUniqueEmail = true
            };

            // Configure validation logic for passwords
            // TODO Review this!
            manager.PasswordValidator = new PasswordValidator
            {
                RequiredLength = 6,
                //RequireNonLetterOrDigit = true,
                RequireDigit = true,
                RequireLowercase = true,
                //RequireUppercase = true,
            };

            manager.EmailService = new EmailService();

            var dataProtectionProvider = options.DataProtectionProvider;
            if (dataProtectionProvider != null)
            {
                manager.UserTokenProvider =
                    new DataProtectorTokenProvider<User, int>(dataProtectionProvider.Create("ASP.NET Identity"));
            }

            return manager;
        }
    }
}
