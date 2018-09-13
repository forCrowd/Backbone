namespace forCrowd.Backbone.DataObjects.Migrations
{
    using BusinessObjects.Entities;
    using DataObjects;
    using Framework;
    using Microsoft.AspNet.Identity;
    using Microsoft.AspNet.Identity.EntityFramework;
    using System;
    using System.Linq;

    public static class V_0_1_2_Updates
    {
        public static void Apply(BackboneContext context)
        {
            // Create roles
            CreateRoles(context);

            // Create initial users
            CreateUser(context, "admin", "admin.backbone@forcrowd.org", "Administrator");
            CreateUser(context, "sample", "sample.backbone@forcrowd.org", "Regular");

            // Create related projects
            CreateWealthEconomy(context);
        }

        private static void CreateWealthEconomy(BackboneContext context)
        {
            // Create Wealth Economy Admin user
            var wealthAdmin = CreateUser(context, "wealthAdmin", "admin.wealth@forcrowd.org", "Regular");

            // Login as (required in order to save the rest of the items)
            Security.LoginAs(wealthAdmin.Id, "Regular");

            var projectStore = context.Set<Project>();

            var project = new Project
            {
                User = wealthAdmin,
                Name = "Wealth Economy",
                Origin = AppSettings.DefaultClientOrigin
            };

            // Sample projects
            CreateBillionDollarQuestion2(project);
            CreatePriorityIndexSample2(project);
            CreateKnowledgeIndexSample2(project);
            CreateKnowledgeIndexSoftwareLicenseSample2(project);
            CreateAllInOneSample2(project);

            // Set Id fields explicitly, since strangely EF doesn't save them in the order that they've been added to ProjectSet.
            // And they're referred with these Ids on front-end samples
            project.Id = 51;

            // Only..
            projectStore.Add(project);

            // First save
            context.SaveChanges();
        }


        private static void CreateRoles(BackboneContext context)
        {
            // Manager & store
            var roleStore = new RoleStore<Role, int, UserRole>(context);
            var roleManager = new RoleManager<Role, int>(roleStore);

            // Guest role
            var guestRole = new Role { Name = "Guest" };
            HandleResult(roleManager.Create(guestRole));

            // Regular role
            var regularRole = new Role { Name = "Regular" };
            HandleResult(roleManager.Create(regularRole));

            // Admin role
            var adminRole = new Role { Name = "Administrator" };
            HandleResult(roleManager.Create(adminRole));

            // Save
            context.SaveChanges();
        }

        private static User CreateUser(BackboneContext context, string userName, string email, string role)
        {
            // Managers & stores & repositories
            var userStore = new AppUserStore(context);
            var userManager = new UserManager<User, int>(userStore);

            // Create user
            var user = new User(userName, email)
            {
                EmailConfirmed = true,
                EmailConfirmationSentOn = DateTime.UtcNow,
                HasPassword = true
            };
            var password = DateTime.Now.ToString("yyyyMMdd");
            HandleResult(userManager.Create(user, password));
            context.SaveChanges();

            // Add to regular role
            HandleResult(userManager.AddToRole(user.Id, role));
            context.SaveChanges();

            return user;
        }

        private static void HandleResult(IdentityResult result)
        {
            if (!result.Succeeded)
            {
                var errorMessages = string.Join(" - ", result.Errors);
                throw new Exception(errorMessages);
            }
        }


        private static void CreateBillionDollarQuestion2(Project project)
        {
            const int numberOfItems = 5;

            // Project
            var mainElement = CreateDefaultProject2(project: project,
                mainElementName: "Issues",
                addImportanceIndex: true,
                numberOfItems: numberOfItems);

            // Fields
            mainElement.ElementFieldSet.Single(item => item.RatingEnabled).Name = "Rating";

            // Items, cell, user cells
            mainElement.ElementItemSet.Skip(0).First().Name = "Cosmetics: Curing baldness";
            mainElement.ElementItemSet.Skip(1).First().Name = "Education: Reducing illiteracy";
            mainElement.ElementItemSet.Skip(2).First().Name = "Entertainment: Enhancing video games";
            mainElement.ElementItemSet.Skip(3).First().Name = "Healthcare: Curing cancer";
            mainElement.ElementItemSet.Skip(4).First().Name = "Poverty: Clean water for everyone";
        }

        private static void CreatePriorityIndexSample2(Project project)
        {
            const int numberOfItems = 4;

            // Project
            var mainElement = CreateDefaultProject2(project: project,
                mainElementName: "Organization",
                addImportanceIndex: false,
                numberOfItems: numberOfItems);

            // Industry element
            var industryElement = project.AddElement("Industry");

            // Importance field
            var importanceField = industryElement.AddField("Industry Rating", ElementFieldDataType.Decimal, false);
            importanceField.EnableIndex();

            // Items, cells, user cells
            var cosmeticsItem = industryElement.AddItem("Cosmetics").AddCell(importanceField).ElementItem;
            var educationItem = industryElement.AddItem("Education").AddCell(importanceField).ElementItem;
            var entertainmentItem = industryElement.AddItem("Entertainment").AddCell(importanceField).ElementItem;
            var healthcareItem = industryElement.AddItem("Healthcare").AddCell(importanceField).ElementItem;

            // Main element
            var industryField = mainElement.AddField("Industry", ElementFieldDataType.Element);
            industryField.SelectedElement = industryElement;

            // Items, cell, user cells
            mainElement.ElementItemSet.Skip(0).First().Name = "Cosmetics Organization";
            mainElement.ElementItemSet.Skip(0).First().AddCell(industryField).SelectedElementItem = cosmeticsItem;
            mainElement.ElementItemSet.Skip(1).First().Name = "Education Organization";
            mainElement.ElementItemSet.Skip(1).First().AddCell(industryField).SelectedElementItem = educationItem;
            mainElement.ElementItemSet.Skip(2).First().Name = "Entertainment Organization";
            mainElement.ElementItemSet.Skip(2).First().AddCell(industryField).SelectedElementItem = entertainmentItem;
            mainElement.ElementItemSet.Skip(3).First().Name = "Healthcare Organization";
            mainElement.ElementItemSet.Skip(3).First().AddCell(industryField).SelectedElementItem = healthcareItem;
        }

        private static void CreateKnowledgeIndexSample2(Project project)
        {
            const int numberOfItems = 2;

            // Project
            var mainElement = CreateDefaultProject2(project: project,
                mainElementName: "Organization",
                addImportanceIndex: false,
                numberOfItems: numberOfItems);

            // License element
            var licenseElement = project.AddElement("License");

            // Fields
            var rightToUseField = licenseElement.AddField("Right to Use", ElementFieldDataType.String);
            var rightToCopyField = licenseElement.AddField("Right to Copy", ElementFieldDataType.String);
            var rightToModifyField = licenseElement.AddField("Right to Modify", ElementFieldDataType.String);
            var rightToSellField = licenseElement.AddField("Right to Sell", ElementFieldDataType.String);
            var licenseRatingField = licenseElement.AddField("License Rating", ElementFieldDataType.Decimal, false);
            licenseRatingField.EnableIndex();

            // Items, cell, user cells
            var restrictedLicense = licenseElement.AddItem("Restricted License")
                .AddCell(rightToUseField).SetValue("Yes").ElementItem
                .AddCell(rightToCopyField).SetValue("No").ElementItem
                .AddCell(rightToModifyField).SetValue("No").ElementItem
                .AddCell(rightToSellField).SetValue("No").ElementItem
                .AddCell(licenseRatingField).ElementItem;

            var openSourceLicense = licenseElement.AddItem("Open Source License")
                .AddCell(rightToUseField).SetValue("Yes").ElementItem
                .AddCell(rightToCopyField).SetValue("Yes").ElementItem
                .AddCell(rightToModifyField).SetValue("Yes").ElementItem
                .AddCell(rightToSellField).SetValue("Yes").ElementItem
                .AddCell(licenseRatingField).ElementItem;

            // Main element
            var licenseField = mainElement.AddField("License", ElementFieldDataType.Element);
            licenseField.SelectedElement = licenseElement;

            // Items, cell, user cells
            // TODO How about ToList()[0]?
            mainElement.ElementItemSet.Skip(0).First().Name = "Hidden Knowledge";
            mainElement.ElementItemSet.Skip(0).First().AddCell(licenseField).SelectedElementItem = restrictedLicense;
            mainElement.ElementItemSet.Skip(1).First().Name = "True Source";
            mainElement.ElementItemSet.Skip(1).First().AddCell(licenseField).SelectedElementItem = openSourceLicense;
        }

        private static void CreateKnowledgeIndexSoftwareLicenseSample2(Project project)
        {
            const int numberOfItems = 4;

            // Project
            var mainElement = CreateDefaultProject2(project: project,
                mainElementName: "License",
                addImportanceIndex: false,
                numberOfItems: numberOfItems);

            // Fields
            var importanceField = mainElement.AddField("License Rating", ElementFieldDataType.Decimal, false);
            importanceField.EnableIndex();

            // Items, cell, user cells
            mainElement.ElementItemSet.Skip(0).First().Name = "Apache-2.0";
            mainElement.ElementItemSet.Skip(0).First().AddCell(importanceField);

            mainElement.ElementItemSet.Skip(1).First().Name = "EULA (Wikipedia)";
            mainElement.ElementItemSet.Skip(1).First().AddCell(importanceField);

            mainElement.ElementItemSet.Skip(2).First().Name = "GPL-3.0";
            mainElement.ElementItemSet.Skip(2).First().AddCell(importanceField);

            mainElement.ElementItemSet.Skip(3).First().Name = "MIT";
            mainElement.ElementItemSet.Skip(3).First().AddCell(importanceField);
        }

        private static void CreateAllInOneSample2(Project project)
        {
            const int numberOfItems = 16;

            // Project
            var mainElement = CreateDefaultProject2(project: project,
                mainElementName: "Organization",
                addImportanceIndex: false,
                numberOfItems: numberOfItems);

            // Industry element
            var industryElement = project.AddElement("Industry");

            // Fields
            var industryRatingField = industryElement.AddField("Industry Rating", ElementFieldDataType.Decimal, false);
            industryRatingField.EnableIndex();

            // Items, cells, user cells
            var cosmeticsItem = industryElement.AddItem("Cosmetics").AddCell(industryRatingField).ElementItem;
            var educationItem = industryElement.AddItem("Education").AddCell(industryRatingField).ElementItem;
            var entertainmentItem = industryElement.AddItem("Entertainment").AddCell(industryRatingField).ElementItem;
            var healthcareItem = industryElement.AddItem("Healthcare").AddCell(industryRatingField).ElementItem;

            // License element
            var licenseElement = project.AddElement("License");

            // Fields
            var rightToUseField = licenseElement.AddField("Right to Use", ElementFieldDataType.String);
            var rightToCopyField = licenseElement.AddField("Right to Copy", ElementFieldDataType.String);
            var rightToModifyField = licenseElement.AddField("Right to Modify", ElementFieldDataType.String);
            var rightToSellField = licenseElement.AddField("Right to Sell", ElementFieldDataType.String);
            var licenseRatingField = licenseElement.AddField("License Rating", ElementFieldDataType.Decimal, false);
            licenseRatingField.EnableIndex();

            // Items, cell, user cells
            var restrictedLicense = licenseElement.AddItem("Restricted License")
                .AddCell(rightToUseField).SetValue("Yes").ElementItem
                .AddCell(rightToCopyField).SetValue("No").ElementItem
                .AddCell(rightToModifyField).SetValue("No").ElementItem
                .AddCell(rightToSellField).SetValue("No").ElementItem
                .AddCell(licenseRatingField).ElementItem;

            var openSourceLicense = licenseElement.AddItem("Open Source License")
                .AddCell(rightToUseField).SetValue("Yes").ElementItem
                .AddCell(rightToCopyField).SetValue("Yes").ElementItem
                .AddCell(rightToModifyField).SetValue("Yes").ElementItem
                .AddCell(rightToSellField).SetValue("Yes").ElementItem
                .AddCell(licenseRatingField).ElementItem;

            var industryField = mainElement.AddField("Industry", ElementFieldDataType.Element);
            industryField.SelectedElement = industryElement;

            var licenseField = mainElement.AddField("License", ElementFieldDataType.Element);
            licenseField.SelectedElement = licenseElement;

            // Items, cell, user cells
            var itemIndex = 0;
            mainElement.ElementItemSet.Skip(itemIndex).First().Name = "Hidden Cosmetics 4Benefit";
            mainElement.ElementItemSet.Skip(itemIndex).First().AddCell(industryField).SelectedElementItem =
                cosmeticsItem;
            mainElement.ElementItemSet.Skip(itemIndex).First().AddCell(licenseField).SelectedElementItem =
                restrictedLicense;

            itemIndex = 1;
            mainElement.ElementItemSet.Skip(itemIndex).First().Name = "Hidden Cosmetics 4Profit";
            mainElement.ElementItemSet.Skip(itemIndex).First().AddCell(industryField).SelectedElementItem =
                cosmeticsItem;
            mainElement.ElementItemSet.Skip(itemIndex).First().AddCell(licenseField).SelectedElementItem =
                restrictedLicense;

            itemIndex = 2;
            mainElement.ElementItemSet.Skip(itemIndex).First().Name = "True Cosmetics 4Benefit";
            mainElement.ElementItemSet.Skip(itemIndex).First().AddCell(industryField).SelectedElementItem =
                cosmeticsItem;
            mainElement.ElementItemSet.Skip(itemIndex).First().AddCell(licenseField).SelectedElementItem =
                openSourceLicense;

            itemIndex = 3;
            mainElement.ElementItemSet.Skip(itemIndex).First().Name = "True Cosmetics 4Profit";
            mainElement.ElementItemSet.Skip(itemIndex).First().AddCell(industryField).SelectedElementItem =
                cosmeticsItem;
            mainElement.ElementItemSet.Skip(itemIndex).First().AddCell(licenseField).SelectedElementItem =
                openSourceLicense;

            itemIndex = 4;
            mainElement.ElementItemSet.Skip(itemIndex).First().Name = "Hidden Education 4Benefit";
            mainElement.ElementItemSet.Skip(itemIndex).First().AddCell(industryField).SelectedElementItem =
                educationItem;
            mainElement.ElementItemSet.Skip(itemIndex).First().AddCell(licenseField).SelectedElementItem =
                restrictedLicense;

            itemIndex = 5;
            mainElement.ElementItemSet.Skip(itemIndex).First().Name = "Hidden Education 4Profit";
            mainElement.ElementItemSet.Skip(itemIndex).First().AddCell(industryField).SelectedElementItem =
                educationItem;
            mainElement.ElementItemSet.Skip(itemIndex).First().AddCell(licenseField).SelectedElementItem =
                restrictedLicense;

            itemIndex = 6;
            mainElement.ElementItemSet.Skip(itemIndex).First().Name = "True Education 4Benefit";
            mainElement.ElementItemSet.Skip(itemIndex).First().AddCell(industryField).SelectedElementItem =
                educationItem;
            mainElement.ElementItemSet.Skip(itemIndex).First().AddCell(licenseField).SelectedElementItem =
                openSourceLicense;

            itemIndex = 7;
            mainElement.ElementItemSet.Skip(itemIndex).First().Name = "True Education 4Profit";
            mainElement.ElementItemSet.Skip(itemIndex).First().AddCell(industryField).SelectedElementItem =
                educationItem;
            mainElement.ElementItemSet.Skip(itemIndex).First().AddCell(licenseField).SelectedElementItem =
                openSourceLicense;

            itemIndex = 8;
            mainElement.ElementItemSet.Skip(itemIndex).First().Name = "Hidden Entertainment 4Benefit";
            mainElement.ElementItemSet.Skip(itemIndex).First().AddCell(industryField).SelectedElementItem =
                entertainmentItem;
            mainElement.ElementItemSet.Skip(itemIndex).First().AddCell(licenseField).SelectedElementItem =
                restrictedLicense;

            itemIndex = 9;
            mainElement.ElementItemSet.Skip(itemIndex).First().Name = "Hidden Entertainment 4Profit";
            mainElement.ElementItemSet.Skip(itemIndex).First().AddCell(industryField).SelectedElementItem =
                entertainmentItem;
            mainElement.ElementItemSet.Skip(itemIndex).First().AddCell(licenseField).SelectedElementItem =
                restrictedLicense;

            itemIndex = 10;
            mainElement.ElementItemSet.Skip(itemIndex).First().Name = "True Entertainment 4Benefit";
            mainElement.ElementItemSet.Skip(itemIndex).First().AddCell(industryField).SelectedElementItem =
                entertainmentItem;
            mainElement.ElementItemSet.Skip(itemIndex).First().AddCell(licenseField).SelectedElementItem =
                openSourceLicense;

            itemIndex = 11;
            mainElement.ElementItemSet.Skip(itemIndex).First().Name = "True Entertainment 4Profit";
            mainElement.ElementItemSet.Skip(itemIndex).First().AddCell(industryField).SelectedElementItem =
                entertainmentItem;
            mainElement.ElementItemSet.Skip(itemIndex).First().AddCell(licenseField).SelectedElementItem =
                openSourceLicense;

            itemIndex = 12;
            mainElement.ElementItemSet.Skip(itemIndex).First().Name = "Hidden Healthcare 4Benefit";
            mainElement.ElementItemSet.Skip(itemIndex).First().AddCell(industryField).SelectedElementItem =
                healthcareItem;
            mainElement.ElementItemSet.Skip(itemIndex).First().AddCell(licenseField).SelectedElementItem =
                restrictedLicense;

            itemIndex = 13;
            mainElement.ElementItemSet.Skip(itemIndex).First().Name = "Hidden Healthcare 4Profit";
            mainElement.ElementItemSet.Skip(itemIndex).First().AddCell(industryField).SelectedElementItem =
                healthcareItem;
            mainElement.ElementItemSet.Skip(itemIndex).First().AddCell(licenseField).SelectedElementItem =
                restrictedLicense;

            itemIndex = 14;
            mainElement.ElementItemSet.Skip(itemIndex).First().Name = "True Healthcare 4Benefit";
            mainElement.ElementItemSet.Skip(itemIndex).First().AddCell(industryField).SelectedElementItem =
                healthcareItem;
            mainElement.ElementItemSet.Skip(itemIndex).First().AddCell(licenseField).SelectedElementItem =
                openSourceLicense;

            itemIndex = 15;
            mainElement.ElementItemSet.Skip(itemIndex).First().Name = "True Healthcare 4Profit";
            mainElement.ElementItemSet.Skip(itemIndex).First().AddCell(industryField).SelectedElementItem =
                healthcareItem;
            mainElement.ElementItemSet.Skip(itemIndex).First().AddCell(licenseField).SelectedElementItem =
                openSourceLicense;
        }

        private static Element CreateDefaultProject2(Project project, string mainElementName, bool addImportanceIndex, int numberOfItems)
        {
            // Main element
            var element = project.AddElement(mainElementName);

            // Importance field
            ElementField importanceField = null;
            if (addImportanceIndex)
            {
                importanceField = element.AddField("Importance Field", ElementFieldDataType.Decimal, false);
                importanceField.EnableIndex();
            }

            // Items, cells, user cells
            for (var i = 1; i <= numberOfItems; i++)
            {
                var itemName = $"Item {i}";

                var item = element.AddItem(itemName);

                if (addImportanceIndex)
                    item.AddCell(importanceField);
            }

            return element;
        }
    }
}

