namespace forCrowd.Backbone.WebApi.Controllers.Api
{
    using System.Diagnostics;
    using System.Reflection;
    using System.Web.Http;

    public class WebApiController : ApiController
    {
        [AllowAnonymous]
        public WebApiInfo WebApiInfo()
        {
            var assembly = Assembly.GetAssembly(GetType());

            var version = FileVersionInfo.GetVersionInfo(assembly.Location).ProductVersion;

            return new WebApiInfo
            {
                Version = version
            };
        }
    }

    public class WebApiInfo
    {
        public string Version { get; set; }
    }
}