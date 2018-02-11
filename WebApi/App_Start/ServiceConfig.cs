namespace forCrowd.Backbone.WebApi
{
    using forCrowd.Backbone.WebApi.Services;
    using System.Web.Http.Controllers;
    using System.Web.Http.ExceptionHandling;

    public static class ServiceConfig
    {
        public static void RegisterServices(ServicesContainer services)
        {
            // Exception logger
            services.Add(typeof(IExceptionLogger), new ElmahExceptionLogger());
        }
    }
}