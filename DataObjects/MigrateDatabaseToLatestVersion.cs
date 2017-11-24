using forCrowd.Backbone.BusinessObjects.Entities;

namespace forCrowd.Backbone.DataObjects
{
    using Migrations;
    using System.Data.Entity;

    internal class MigrateDatabaseToLatestVersion : MigrateDatabaseToLatestVersion<BackboneContext, DbMigrationsConfiguration>
    {
        public bool IsTest { get; private set; }

        public MigrateDatabaseToLatestVersion(bool isTest = false)
        {
            IsTest = isTest;
        }

        public override void InitializeDatabase(BackboneContext context)
        {
            // If it's test, drop it first
            if (IsTest && context.Database.Exists())
                context.Database.Delete();

            base.InitializeDatabase(context);
        }
    }
}
