namespace forCrowd.Backbone.WebApi.Filters
{
    using System.Net;
    using System.Net.Http;
    using System.Web.Http.Filters;

    public class ExceptionHandlerAttribute : ActionFilterAttribute
    {
        public override void OnActionExecuted(HttpActionExecutedContext actionExecutedContext)
        {
            EnsureExceptionMessage(actionExecutedContext);
            base.OnActionExecuted(actionExecutedContext);
        }

        private void EnsureExceptionMessage(HttpActionExecutedContext actionExecutedContext)
        {
            if (actionExecutedContext.Exception != null)
            {
                actionExecutedContext.Response = new HttpResponseMessage(HttpStatusCode.InternalServerError)
                {
                    Content = new StringContent("Internal server error")
                };
            }
        }
    }
}
