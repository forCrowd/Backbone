using forCrowd.Backbone.BusinessObjects.Entities;
using forCrowd.Backbone.Framework;
using System;
using System.Data.Entity;
using System.Linq;

namespace forCrowd.Backbone.DataMigrator
{
    class Program
    {
        static void Main(string[] args)
        {
            using (var sourceContext = new BackboneContext("SourceContext"))
            {
                using (var targetContext = new BackboneContext("TargetContext"))
                {
                    // Init
                    Security.LoginAs(-1, "Administrator");
                    sourceContext.Configuration.AutoDetectChangesEnabled = false;
                    targetContext.Database.CreateIfNotExists();
                    targetContext.Configuration.AutoDetectChangesEnabled = false;

                    // Roles
                    if (!targetContext.Roles.Any())
                    {
                        var sourceRoles = sourceContext.Roles.AsEnumerable();

                        foreach (var sourceRole in sourceRoles)
                        {
                            var targetRole = new Role
                            {
                                Name = sourceRole.Name,
                                CreatedOn = sourceRole.CreatedOn,
                                ModifiedOn = sourceRole.ModifiedOn,
                                DeletedOn = sourceRole.DeletedOn,
                            };

                            targetContext.Roles.Add(targetRole);
                        }
                    }

                    // Users
                    var sourceUsers = sourceContext.Users
                        .Include(x => x.Logins)
                        .Include(x => x.Roles)
                        .AsEnumerable();

                    foreach (var sourceUser in sourceUsers)
                    {
                        Console.WriteLine($"User: {sourceUser.Id}");

                        var targetUser = new User
                        {
                            UserName = sourceUser.UserName,
                            Email = sourceUser.Email,
                            EmailConfirmed = sourceUser.EmailConfirmed,
                            EmailConfirmationSentOn = sourceUser.EmailConfirmationSentOn,
                            HasPassword = sourceUser.HasPassword,
                            PasswordHash = sourceUser.PasswordHash,
                            SecurityStamp = sourceUser.SecurityStamp,
                            SingleUseToken = sourceUser.SingleUseToken,
                            FirstName = sourceUser.FirstName,
                            MiddleName = sourceUser.MiddleName,
                            LastName = sourceUser.LastName,
                            Notes = sourceUser.Notes,
                            CreatedOn = sourceUser.CreatedOn,
                            ModifiedOn = sourceUser.ModifiedOn,
                            DeletedOn = sourceUser.DeletedOn,
                        };

                        targetContext.Users.Add(targetUser);

                        // User roles
                        var sourceUserRoles = sourceUser.Roles;

                        foreach (var sourceUserRole in sourceUserRoles)
                        {
                            // Console.WriteLine($"User role {sourceUserRole.UserId} - {sourceUserRole.RoleId}");

                            var targetUserRole = new UserRole
                            {
                                User = targetUser,
                                RoleId = sourceUserRole.RoleId,
                                CreatedOn = sourceUserRole.CreatedOn,
                                ModifiedOn = sourceUserRole.ModifiedOn,
                                DeletedOn = sourceUserRole.DeletedOn,
                            };

                            targetUser.Roles.Add(targetUserRole);
                        }

                        // User logins
                        var sourceUserLogins = sourceUser.Logins;

                        foreach (var sourceUserLogin in sourceUserLogins)
                        {
                            // Console.WriteLine("user login " + userLogin.LoginProvider);

                            var targetUserLogin = new UserLogin
                            {
                                User = targetUser,
                                LoginProvider = sourceUserLogin.LoginProvider,
                                ProviderKey = sourceUserLogin.ProviderKey,
                                CreatedOn = sourceUserLogin.CreatedOn,
                                ModifiedOn = sourceUserLogin.ModifiedOn,
                                DeletedOn = sourceUserLogin.DeletedOn,
                            };

                            targetUser.Logins.Add(targetUserLogin);
                        }
                    }

                    // Projects
                    var projects = sourceContext.Project
                        .Include(x => x.User)
                        .Include(x => x.ElementSet)
                        .ToList();

                    foreach (var sourceProject in projects)
                    {
                        Console.WriteLine($"Project: {sourceProject.Name}");

                        var targetProject = new Project
                        {
                            User = targetContext.Users.Local.Single(x => x.UserName == sourceProject.User.UserName),
                            Name = sourceProject.Name,
                            Origin = sourceProject.Origin,
                            Description = sourceProject.Description,
                            RatingCount = sourceProject.RatingCount,
                            CreatedOn = sourceProject.CreatedOn,
                            ModifiedOn = sourceProject.ModifiedOn,
                            DeletedOn = sourceProject.DeletedOn,
                        };

                        targetContext.Project.Add(targetProject);

                        // Elements
                        var elements = sourceProject.ElementSet;

                        foreach (var sourceElement in elements)
                        {
                            // Console.WriteLine($"Element {sourceElement.Name}");

                            var targetElement = new Element
                            {
                                Project = targetProject,
                                Name = sourceElement.Name,
                                CreatedOn = sourceElement.CreatedOn,
                                ModifiedOn = sourceElement.ModifiedOn,
                                DeletedOn = sourceElement.DeletedOn,
                            };

                            targetContext.Element.Add(targetElement);

                            // Fields
                            var sourceFields = sourceContext.ElementField
                                .Include(x => x.UserElementFieldSet)
                                .Where(x => x.ElementId == sourceElement.Id)
                                .AsEnumerable();

                            foreach (var sourceField in sourceFields)
                            {
                                var targetField = new ElementField
                                {
                                    Element = targetElement,
                                    Name = sourceField.Name,
                                    DataType = sourceField.DataType,
                                    UseFixedValue = sourceField.UseFixedValue,
                                    RatingEnabled = sourceField.RatingEnabled,
                                    SortOrder = sourceField.SortOrder,
                                    RatingTotal = sourceField.RatingTotal,
                                    RatingCount = sourceField.RatingCount,
                                    CreatedOn = sourceField.CreatedOn,
                                    ModifiedOn = sourceField.ModifiedOn,
                                    DeletedOn = sourceField.DeletedOn,
                                };

                                // Selected element
                                if (sourceField.SelectedElement != null)
                                {
                                    targetField.SelectedElement = targetContext.Element
                                        .Local
                                        .Single(x => x.Project == targetProject
                                            && x.Name == sourceField.SelectedElement.Name);
                                }

                                targetContext.ElementField.Add(targetField);

                                // User fields
                                var userFieldSet = sourceField.UserElementFieldSet;

                                foreach (var sourceUserField in userFieldSet)
                                {
                                    var targetUserElementField = new UserElementField
                                    {
                                        User = targetContext.Users.Local.Single(x => x.UserName == sourceUserField.User.UserName),
                                        ElementField = targetField,
                                        Rating = sourceUserField.Rating,
                                        CreatedOn = sourceUserField.CreatedOn,
                                        ModifiedOn = sourceUserField.ModifiedOn,
                                        DeletedOn = sourceUserField.DeletedOn,
                                    };

                                    targetContext.UserElementField.Add(targetUserElementField);
                                }
                            }

                            // Items
                            var sourceItems = sourceContext.ElementItem
                                .Include(x => x.ElementCellSet.Select(e => e.UserElementCellSet))
                                .Where(x => x.ElementId == sourceElement.Id)
                                .AsEnumerable();

                            foreach (var sourceItem in sourceItems)
                            {
                                var targetItem = new ElementItem
                                {
                                    Element = targetElement,
                                    Name = sourceItem.Name,
                                    CreatedOn = sourceItem.CreatedOn,
                                    ModifiedOn = sourceItem.ModifiedOn,
                                    DeletedOn = sourceItem.DeletedOn,
                                };

                                targetContext.ElementItem.Add(targetItem);

                                // Cells
                                var sourceCells = sourceItem.ElementCellSet;

                                foreach (var sourceCell in sourceCells)
                                {
                                    var targetCell = new ElementCell
                                    {
                                        ElementField = targetContext.ElementField.Local.Single(x => x.Element == targetItem.Element && x.Name == sourceCell.ElementField.Name),
                                        ElementItem = targetItem,
                                        StringValue = sourceCell.StringValue,
                                        DecimalValueTotal = sourceCell.DecimalValueTotal,
                                        DecimalValueCount = sourceCell.DecimalValueCount,
                                        CreatedOn = sourceCell.CreatedOn,
                                        ModifiedOn = sourceCell.ModifiedOn,
                                        DeletedOn = sourceCell.DeletedOn,
                                    };

                                    // Selected item
                                    if (sourceCell.SelectedElementItem != null)
                                    {
                                        targetCell.SelectedElementItem = targetContext.ElementItem
                                            .Local
                                            .Single(x => x.Element.Project == targetProject && x.Name == sourceCell.SelectedElementItem.Name);
                                    }

                                    targetContext.ElementCell.Add(targetCell);

                                    // User cells
                                    var sourceUserCells = sourceCell.UserElementCellSet;

                                    foreach (var sourceUserCell in sourceUserCells)
                                    {
                                        var targetUserCell = new UserElementCell
                                        {
                                            User = targetContext.Users.Local.Single(x => x.UserName == sourceUserCell.User.UserName),
                                            ElementCell = targetCell,
                                            DecimalValue = sourceUserCell.DecimalValue,
                                            CreatedOn = sourceUserCell.CreatedOn,
                                            ModifiedOn = sourceUserCell.ModifiedOn,
                                            DeletedOn = sourceUserCell.DeletedOn,
                                        };

                                        targetContext.UserElementCell.Add(targetUserCell);
                                    }
                                }
                            }
                        }
                    }

                    // Save
                    targetContext.SaveChanges();
                }
            }

            Console.WriteLine("");
            Console.WriteLine(" - Finito! - ");

            Console.ReadKey();
        }
    }
}
