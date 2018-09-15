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
            // Create Wealth Economy Admin user
            var wealthAdmin = CreateUser(context, "wealthAdmin", "admin.wealth@forcrowd.org", "Regular");

            // Login as (required in order to save the rest of the items)
            Security.LoginAs(wealthAdmin.Id, "Regular");

            // New
            CreateWealthEconomy(context, wealthAdmin);
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

        private static void CreateWealthEconomy(BackboneContext context, User wealthAdmin)
        {
            var projectStore = context.Set<Project>();

            // Sample projects
            var billionDollarQuestion = CreateBillionDollarQuestion(wealthAdmin);
            var priorityIndexSample = CreatePriorityIndexSample(wealthAdmin);
            var knowledgeIndexSample = CreateKnowledgeIndexSample(wealthAdmin);
            var knowledgeIndexSoftwareLicenseSample = CreateKnowledgeIndexSoftwareLicenseSample(wealthAdmin);
            var allInOneSample = CreateAllInOneSample(wealthAdmin);

            // Set Id fields explicitly, since strangely EF doesn't save them in the order that they've been added to ProjectSet.
            // And they're referred with these Ids on front-end samples
            billionDollarQuestion.Id = 1;
            priorityIndexSample.Id = 2;
            knowledgeIndexSample.Id = 3;
            knowledgeIndexSoftwareLicenseSample.Id = 4;
            allInOneSample.Id = 5;

            // Insert
            projectStore.Add(billionDollarQuestion);
            projectStore.Add(priorityIndexSample);
            projectStore.Add(knowledgeIndexSample);
            projectStore.Add(knowledgeIndexSoftwareLicenseSample);
            projectStore.Add(allInOneSample);

            // First save
            context.SaveChanges();
        }

        private static Project CreateBillionDollarQuestion(User user)
        {
            const int numberOfItems = 5;

            // Project
            var project = CreateDefaultProject(user: user,
                projectName: "Billion Dollar Question",
                mainElementName: "Issues",
                addImportanceIndex: true,
                numberOfItems: numberOfItems);

            // Main element
            var mainElement = project.ElementSet.First();

            // Fields
            mainElement.ElementFieldSet.Single(item => item.RatingEnabled).Name = "Rating";

            // Items, cell, user cells
            mainElement.ElementItemSet.Skip(0).First().Name = "Cosmetics: Curing baldness";
            mainElement.ElementItemSet.Skip(1).First().Name = "Education: Reducing illiteracy";
            mainElement.ElementItemSet.Skip(2).First().Name = "Entertainment: Enhancing video games";
            mainElement.ElementItemSet.Skip(3).First().Name = "Healthcare: Curing cancer";
            mainElement.ElementItemSet.Skip(4).First().Name = "Poverty: Clean water for everyone";

            // Return
            return project;
        }

        private static Project CreatePriorityIndexSample(User user)
        {
            const int numberOfItems = 4;

            // Project
            var project = CreateDefaultProject(user: user,
                projectName: "Priority Index Sample",
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
            var mainElement = project.ElementSet.First();
            var industryField = mainElement.AddField("Industry", ElementFieldDataType.Element);
            industryField.SelectedElement = industryElement;

            // Items, cell, user cells
            mainElement.ElementItemSet.Skip(0).First().Name = "Cosmetics Organization";
            mainElement.ElementItemSet.Skip(0).First().AddCell(industryField).SetValue(cosmeticsItem);
            mainElement.ElementItemSet.Skip(1).First().Name = "Education Organization";
            mainElement.ElementItemSet.Skip(1).First().AddCell(industryField).SetValue(educationItem);
            mainElement.ElementItemSet.Skip(2).First().Name = "Entertainment Organization";
            mainElement.ElementItemSet.Skip(2).First().AddCell(industryField).SetValue(entertainmentItem);
            mainElement.ElementItemSet.Skip(3).First().Name = "Healthcare Organization";
            mainElement.ElementItemSet.Skip(3).First().AddCell(industryField).SetValue(healthcareItem);

            // Return
            return project;
        }

        private static Project CreateKnowledgeIndexSample(User user)
        {
            const int numberOfItems = 2;

            // Project
            var project = CreateDefaultProject(user: user,
                projectName: "Knowledge Index Sample",
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
            var mainElement = project.ElementSet.First();
            var licenseField = mainElement.AddField("License", ElementFieldDataType.Element);
            licenseField.SelectedElement = licenseElement;

            // Items, cell, user cells
            // TODO How about ToList()[0]?
            mainElement.ElementItemSet.Skip(0).First().Name = "Hidden Knowledge";
            mainElement.ElementItemSet.Skip(0).First().AddCell(licenseField).SetValue(restrictedLicense);
            mainElement.ElementItemSet.Skip(1).First().Name = "True Source";
            mainElement.ElementItemSet.Skip(1).First().AddCell(licenseField).SetValue(openSourceLicense);

            // Return
            return project;
        }

        private static Project CreateKnowledgeIndexSoftwareLicenseSample(User user)
        {
            const int numberOfItems = 4;

            // Project
            var project = CreateDefaultProject(user: user,
                projectName: "Knowledge Index - Software Licenses",
                mainElementName: "License",
                addImportanceIndex: false,
                numberOfItems: numberOfItems);

            // Main element
            var mainElement = project.ElementSet.First();

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

            // Return
            return project;
        }

        private static Project CreateAllInOneSample(User user)
        {
            const int numberOfItems = 16;

            // Project
            var project = CreateDefaultProject(user: user,
                projectName: "All in One",
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

            // Main element
            var mainElement = project.ElementSet.First();

            var industryField = mainElement.AddField("Industry", ElementFieldDataType.Element);
            industryField.SelectedElement = industryElement;

            var licenseField = mainElement.AddField("License", ElementFieldDataType.Element);
            licenseField.SelectedElement = licenseElement;

            // Items, cell, user cells
            var itemIndex = 0;
            mainElement.ElementItemSet.Skip(itemIndex).First().Name = "Hidden Cosmetics 4Benefit";
            mainElement.ElementItemSet.Skip(itemIndex).First().AddCell(industryField).SetValue(cosmeticsItem);
            mainElement.ElementItemSet.Skip(itemIndex).First().AddCell(licenseField).SetValue(restrictedLicense);

            itemIndex = 1;
            mainElement.ElementItemSet.Skip(itemIndex).First().Name = "Hidden Cosmetics 4Profit";
            mainElement.ElementItemSet.Skip(itemIndex).First().AddCell(industryField).SetValue(cosmeticsItem);
            mainElement.ElementItemSet.Skip(itemIndex).First().AddCell(licenseField).SetValue(restrictedLicense);

            itemIndex = 2;
            mainElement.ElementItemSet.Skip(itemIndex).First().Name = "True Cosmetics 4Benefit";
            mainElement.ElementItemSet.Skip(itemIndex).First().AddCell(industryField).SetValue(cosmeticsItem);
            mainElement.ElementItemSet.Skip(itemIndex).First().AddCell(licenseField).SetValue(openSourceLicense);

            itemIndex = 3;
            mainElement.ElementItemSet.Skip(itemIndex).First().Name = "True Cosmetics 4Profit";
            mainElement.ElementItemSet.Skip(itemIndex).First().AddCell(industryField).SetValue(cosmeticsItem);
            mainElement.ElementItemSet.Skip(itemIndex).First().AddCell(licenseField).SetValue(openSourceLicense);

            itemIndex = 4;
            mainElement.ElementItemSet.Skip(itemIndex).First().Name = "Hidden Education 4Benefit";
            mainElement.ElementItemSet.Skip(itemIndex).First().AddCell(industryField).SetValue(educationItem);
            mainElement.ElementItemSet.Skip(itemIndex).First().AddCell(licenseField).SetValue(restrictedLicense);

            itemIndex = 5;
            mainElement.ElementItemSet.Skip(itemIndex).First().Name = "Hidden Education 4Profit";
            mainElement.ElementItemSet.Skip(itemIndex).First().AddCell(industryField).SetValue(educationItem);
            mainElement.ElementItemSet.Skip(itemIndex).First().AddCell(licenseField).SetValue(restrictedLicense);

            itemIndex = 6;
            mainElement.ElementItemSet.Skip(itemIndex).First().Name = "True Education 4Benefit";
            mainElement.ElementItemSet.Skip(itemIndex).First().AddCell(industryField).SetValue(educationItem);
            mainElement.ElementItemSet.Skip(itemIndex).First().AddCell(licenseField).SetValue(openSourceLicense);

            itemIndex = 7;
            mainElement.ElementItemSet.Skip(itemIndex).First().Name = "True Education 4Profit";
            mainElement.ElementItemSet.Skip(itemIndex).First().AddCell(industryField).SetValue(educationItem);
            mainElement.ElementItemSet.Skip(itemIndex).First().AddCell(licenseField).SetValue(openSourceLicense);

            itemIndex = 8;
            mainElement.ElementItemSet.Skip(itemIndex).First().Name = "Hidden Entertainment 4Benefit";
            mainElement.ElementItemSet.Skip(itemIndex).First().AddCell(industryField).SetValue(entertainmentItem);
            mainElement.ElementItemSet.Skip(itemIndex).First().AddCell(licenseField).SetValue(restrictedLicense);

            itemIndex = 9;
            mainElement.ElementItemSet.Skip(itemIndex).First().Name = "Hidden Entertainment 4Profit";
            mainElement.ElementItemSet.Skip(itemIndex).First().AddCell(industryField).SetValue(entertainmentItem);
            mainElement.ElementItemSet.Skip(itemIndex).First().AddCell(licenseField).SetValue(restrictedLicense);

            itemIndex = 10;
            mainElement.ElementItemSet.Skip(itemIndex).First().Name = "True Entertainment 4Benefit";
            mainElement.ElementItemSet.Skip(itemIndex).First().AddCell(industryField).SetValue(entertainmentItem);
            mainElement.ElementItemSet.Skip(itemIndex).First().AddCell(licenseField).SetValue(openSourceLicense);

            itemIndex = 11;
            mainElement.ElementItemSet.Skip(itemIndex).First().Name = "True Entertainment 4Profit";
            mainElement.ElementItemSet.Skip(itemIndex).First().AddCell(industryField).SetValue(entertainmentItem);
            mainElement.ElementItemSet.Skip(itemIndex).First().AddCell(licenseField).SetValue(openSourceLicense);

            itemIndex = 12;
            mainElement.ElementItemSet.Skip(itemIndex).First().Name = "Hidden Healthcare 4Benefit";
            mainElement.ElementItemSet.Skip(itemIndex).First().AddCell(industryField).SetValue(healthcareItem);
            mainElement.ElementItemSet.Skip(itemIndex).First().AddCell(licenseField).SetValue(restrictedLicense);

            itemIndex = 13;
            mainElement.ElementItemSet.Skip(itemIndex).First().Name = "Hidden Healthcare 4Profit";
            mainElement.ElementItemSet.Skip(itemIndex).First().AddCell(industryField).SetValue(healthcareItem);
            mainElement.ElementItemSet.Skip(itemIndex).First().AddCell(licenseField).SetValue(restrictedLicense);

            itemIndex = 14;
            mainElement.ElementItemSet.Skip(itemIndex).First().Name = "True Healthcare 4Benefit";
            mainElement.ElementItemSet.Skip(itemIndex).First().AddCell(industryField).SetValue(healthcareItem);
            mainElement.ElementItemSet.Skip(itemIndex).First().AddCell(licenseField).SetValue(openSourceLicense);

            itemIndex = 15;
            mainElement.ElementItemSet.Skip(itemIndex).First().Name = "True Healthcare 4Profit";
            mainElement.ElementItemSet.Skip(itemIndex).First().AddCell(industryField).SetValue(healthcareItem);
            mainElement.ElementItemSet.Skip(itemIndex).First().AddCell(licenseField).SetValue(openSourceLicense);

            // Return
            return project;
        }

        private static Project CreateDefaultProject(User user, string projectName, string mainElementName, bool addImportanceIndex, int numberOfItems)
        {
            // Project, main element, fields
            var project = new Project
            {
                User = user,
                Name = projectName,
                Origin = AppSettings.DefaultClientOrigin
            };

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

            // Return
            return project;
        }
    }
}
