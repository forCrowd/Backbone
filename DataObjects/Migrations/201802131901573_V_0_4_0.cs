namespace forCrowd.Backbone.DataObjects.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class V_0_4_0 : DbMigration
    {
        public override void Up()
        {
            DropIndex("dbo.Project", "UX_Project_UserId_Key");
            CreateIndex("dbo.Project", "UserId");
            DropColumn("dbo.Project", "Key");
        }
        
        public override void Down()
        {
            AddColumn("dbo.Project", "Key", c => c.String(nullable: false, maxLength: 250));
            DropIndex("dbo.Project", new[] { "UserId" });
            CreateIndex("dbo.Project", new[] { "UserId", "Key" }, unique: true, name: "UX_Project_UserId_Key");
        }
    }
}
