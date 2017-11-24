namespace forCrowd.Backbone.WebApi.Controllers.Api
{
    using Facade;
    using System.Data.Entity;
    using System.Net;
    using System.Threading.Tasks;
    using System.Web.Http;

    [RoutePrefix("api/v1/ProjectApi")]
    public class ProjectApiController : BaseApiController
    {
        private ProjectManager _projectManager;

        protected ProjectManager ProjectManager => _projectManager ?? (_projectManager = new ProjectManager());

        [Authorize(Roles = "Administrator")]
        [HttpPost]
        [Route("{projectId}/UpdateComputedFields")]
        public async Task<IHttpActionResult> UpdateComputedFields(int projectId)
        {
            var project = await ProjectManager.GetProjectSet(projectId).SingleOrDefaultAsync();

            if (project == null)
            {
                return NotFound();
            }

            await ProjectManager.UpdateComputedFieldsAsync(projectId);

            return StatusCode(HttpStatusCode.NoContent);
        }
    }
}
