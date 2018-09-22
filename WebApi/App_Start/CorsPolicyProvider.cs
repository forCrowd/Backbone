using System.Collections.Generic;

namespace forCrowd.Backbone.WebApi
{
    using BusinessObjects.Entities;
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
                SupportsCredentials = true,
                AllowAnyOrigin = false
            };

#if DEBUG
            policy.AllowAnyOrigin = true;
#endif

            // Allowed origins: Default client origin and projects' Origin field
            var allowedOrigin = new List<string> { Framework.AppSettings.DefaultClientOrigin };

            using (var db = new BackboneContext())
            {
                allowedOrigin.AddRange(db.Project
                    .Select(project => project.Origin)
                    .Distinct()
                    .ToArray());
            }

            foreach (var allowedDomain in allowedOrigin.Distinct())
                policy.Origins.Add(allowedDomain);

            return Task.FromResult(policy);
        }
    }
}
