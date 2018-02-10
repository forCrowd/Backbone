namespace forCrowd.Backbone.DataObjects.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class V_0_2_0 : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.Project", "Origin", c => c.String(nullable: false, maxLength: 500));
        }
        
        public override void Down()
        {
            DropColumn("dbo.Project", "Origin");
        }
    }
}
