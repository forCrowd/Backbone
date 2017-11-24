using forCrowd.Backbone.BusinessObjects.Entities;
using forCrowd.Backbone.DataObjects;
using Microsoft.Data.Edm;

namespace forCrowd.Backbone.Facade
{
    // Misc. method for the application
    // TODO Categorize them better ?!
    public static class DbUtility
    {
        public static void InitializeDatabase()
        {
            DatabaseInitializer.Initialize();
        }

        public static IEdmModel GetBackboneEdm()
        {
            return EdmBuilder.GetEdm<BackboneContext>();
        }
    }
}