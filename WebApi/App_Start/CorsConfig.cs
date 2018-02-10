namespace forCrowd.Backbone.WebApi
{
    using Microsoft.Owin.Cors;
    using Owin;

    public static class CorsConfig
    {
        public static void ConfigureCors(IAppBuilder app)
        {
            app.UseCors(new CorsOptions
            {
                PolicyProvider = new CorsPolicyProvider()
            });
        }
    }
}
