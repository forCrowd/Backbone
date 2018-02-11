namespace forCrowd.Backbone.WebApi
{
    using System.Web.Http.Filters;

    public static class FilterConfig
    {
        public static void RegisterFilters(HttpFilterCollection filters)
        {
            // DataServiceVersion header
            filters.Add(new Filters.DataServiceVersionHeaderAttribute());

            // ValidateModel
            filters.Add(new Filters.ValidateModelAttribute());

            // Exception handler
            filters.Add(new Filters.ExceptionHandlerAttribute());
        }
    }
}
