namespace forCrowd.Backbone.DataObjects.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class V_0_7_4 : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.Element", "SortOrder", c => c.Byte(nullable: false));
        }
        
        public override void Down()
        {
            DropColumn("dbo.Element", "SortOrder");
        }
    }
}
