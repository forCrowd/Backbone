using System;
using forCrowd.Backbone.BusinessObjects.Entities;

namespace forCrowd.Backbone.DataObjects.Migrations
{
    using System.Collections.Generic;
    using System.Data.Entity.Migrations;

    internal sealed class DbMigrationsConfiguration : DbMigrationsConfiguration<BackboneContext>
    {
        private readonly IEnumerable<string> pendingMigrations;

        public DbMigrationsConfiguration()
        {
            ContextKey = "BackboneContext";
            AutomaticMigrationsEnabled = false;

            // Get the migrations
            var migrator = new DbMigrator(this);
            pendingMigrations = migrator.GetPendingMigrations();
        }

        protected override void Seed(BackboneContext context)
        {
            // Data per migration
            foreach (var migration in pendingMigrations)
            {
                // Get the version number
                var migrationVersion = migration.Substring(migration.IndexOf("_", StringComparison.Ordinal) + 1);

                switch (migrationVersion)
                {
                    case "V_0_1_2":
                        {
                            V_0_1_2_Updates.Apply(context); // Initial data
                            break;
                        }
                }
            }
        }
    }
}
