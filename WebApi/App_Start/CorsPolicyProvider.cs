namespace forCrowd.Backbone.WebApi
{
    using forCrowd.Backbone.BusinessObjects.Entities;
    using Microsoft.Owin;
    using Microsoft.Owin.Cors;
    using System.Linq;
    using System.Threading.Tasks;
    using System.Web.Cors;

    public class CorsPolicyProvider : ICorsPolicyProvider
    {
        public Task<CorsPolicy> GetCorsPolicyAsync(IOwinRequest request)
        {
            var policy = new CorsPolicy
            {
                AllowAnyHeader = true,
                AllowAnyMethod = true,
                SupportsCredentials = true
            };

            // Allowed origins
            policy.AllowAnyOrigin = false;

            // Default client origin
            policy.Origins.Add(Framework.AppSettings.DefaultClientOrigin);

            using (var db = new BackboneContext())
            {
                var allowedOrigins = db.Project
                    .Select(project => project.Origin)
                    .Distinct()
                    .ToArray();

                foreach (var allowedDomain in allowedOrigins)
                {
                    policy.Origins.Add(allowedDomain);
                }
            }

            return Task.FromResult(policy);
        }
    }
}
