namespace forCrowd.Backbone.WebApi.Controllers.OData
{
    using BusinessObjects.Entities;
    using Facade;
    using Filters;
    using Microsoft.AspNet.Identity;
    using System;
    using System.Data.Entity;
    using System.Linq;
    using System.Net;
    using System.Threading.Tasks;
    using System.Web.Http;
    using System.Web.Http.OData;

    public class ProjectController : BaseODataController
    {
        private readonly ProjectManager _projectManager = new ProjectManager();

        // GET odata/Project
        [AllowAnonymous]
        public IQueryable<Project> Get()
        {
            var query = _projectManager.GetProjectSet(null, true, project => project.User);

            // Don't return user details to other users
            // TODO This is a bit hacky, find a better way! / coni2k - 08 Dec. '18
            var currentUserId = User.Identity.GetUserId<int>();
            foreach (var item in query.Where(item => item.UserId != currentUserId))
            {
                item.User.ResetValues();
            }

            return query;
        }

        // GET odata/Project(1)
        [AllowAnonymous]
        public IQueryable<Project> Get([FromODataUri] int key)
        {
            var query = _projectManager.GetProjectSet(key, true, project => project.User);

            // Don't return user details to other users
            // TODO This is a bit hacky, find a better way! / coni2k - 08 Dec. '18
            var currentUserId = User.Identity.GetUserId<int>();
            foreach (var item in query.Where(item => item.UserId != currentUserId))
            {
                item.User.ResetValues();
            }

            return query;
        }

        // POST odata/Project
        public async Task<IHttpActionResult> Post(Delta<Project> patch)
        {
            var project = patch.GetEntity();

            // Don't allow the user to set these fields / coni2k - 29 Jul. '17
            // TODO Use ForbiddenFieldsValidator?: Currently breeze doesn't allow to post custom (delta) entity
            // TODO Or use DTO?: Needs a different metadata than the context, which can be overkill
            project.Id = 0;
            //project.UserId = 0;
            project.RatingCount = 0;
            project.CreatedOn = DateTime.UtcNow;
            project.ModifiedOn = DateTime.UtcNow;
            project.DeletedOn = null;

            // Owner check: Entity must belong to the current user
            var currentUserId = User.Identity.GetUserId<int>();
            if (currentUserId != project.UserId)
            {
                return StatusCode(HttpStatusCode.Forbidden);
            }

            await _projectManager.AddProjectAsync(project);

            return Created(project);
        }

        // PATCH odata/Project(5)
        [AcceptVerbs("PATCH", "MERGE")]
        [ForbiddenFieldsValidator(nameof(Project.Id), nameof(Project.UserId), nameof(Project.RatingCount), nameof(Project.CreatedOn), nameof(Project.ModifiedOn), nameof(Project.DeletedOn))]
        [EntityExistsValidator(typeof(Project))]
        [ConcurrencyValidator(typeof(Project))]
        public async Task<IHttpActionResult> Patch(int key, Delta<Project> patch)
        {
            var project = await _projectManager.GetProjectSet(key).SingleOrDefaultAsync();

            // Owner check: Entity must belong to the current user
            var currentUserId = User.Identity.GetUserId<int>();
            if (currentUserId != project.UserId)
            {
                return StatusCode(HttpStatusCode.Forbidden);
            }

            patch.Patch(project);

            await _projectManager.SaveChangesAsync();

            return Ok(project);
        }

        // DELETE odata/Project(5)
        [EntityExistsValidator(typeof(Project))]
        // TODO breeze doesn't support this at the moment / coni2k - 31 Jul. '17
        // [ConcurrencyValidator(typeof(Project))]
        public async Task<IHttpActionResult> Delete(int key)
        {
            var project = await _projectManager.GetProjectSet(key).SingleOrDefaultAsync();

            // Owner check: Entity must belong to the current user
            var currentUserId = User.Identity.GetUserId<int>();

            if (currentUserId != project.UserId)
            {
                return StatusCode(HttpStatusCode.Forbidden);
            }

            await _projectManager.DeleteProjectAsync(project.Id);

            return StatusCode(HttpStatusCode.NoContent);
        }
    }
}
