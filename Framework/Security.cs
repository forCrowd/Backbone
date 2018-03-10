using System.Collections.Generic;
using System.Linq;
using System.Security;
using System.Security.Claims;
using System.Threading;

namespace forCrowd.Backbone.Framework
{
    public static class Security
    {
        public const string AUTHENTICATIONTYPE = "LocalAuth";

        public static void LoginAs(int userId, string role)
        {
            var nameIdentifierClaim = new Claim(ClaimTypes.NameIdentifier, userId.ToString(), ClaimValueTypes.Integer32);
            var roleClaim = new Claim(ClaimTypes.Role, role);
            var claims = new HashSet<Claim> { nameIdentifierClaim, roleClaim };
            var sampleIdentity = new ClaimsIdentity(claims, AUTHENTICATIONTYPE);
            var samplePrincipal = new ClaimsPrincipal(sampleIdentity);
            Thread.CurrentPrincipal = samplePrincipal;
        }

        public static void ValidateCurrentUser()
        {
            // Check that there is an authenticated user in this context
            var identity = Thread.CurrentPrincipal.Identity as ClaimsIdentity;
            if (identity == null)
            {
                throw new SecurityException("Unauthenticated access");
            }

            var userIdclaim = identity.Claims.SingleOrDefault(c => c.Type == ClaimTypes.NameIdentifier);
            if (userIdclaim == null)
            {
                throw new SecurityException("Unauthenticated access");
            }

            int.TryParse(userIdclaim.Value, out int userId);
            if (userId == 0)
            {
                throw new SecurityException("Unauthenticated access");
            }
        }
    }
}
