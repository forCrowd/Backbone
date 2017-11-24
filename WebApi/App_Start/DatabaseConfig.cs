using forCrowd.Backbone.Facade;

namespace forCrowd.Backbone.WebApi
{
    public static class DatabaseConfig
    {
        public static void Initialize()
        {
            DbUtility.InitializeDatabase();
        }
    }
}
