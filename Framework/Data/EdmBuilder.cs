/*****************************************************
 * Breeze Labs: EdmBuilder
 *
 * v.1.0.4
 * Copyright 2014 IdeaBlade, Inc.  All Rights Reserved.  
 * Licensed under the MIT License
 * http://opensource.org/licenses/mit-license.php
 * 
 * Thanks to Javier Calvarro Nelson for the initial version
 * Thanks to Serkan Holat for the ModelFirst extension
 *****************************************************/
using Microsoft.Data.Edm.Csdl;
using Microsoft.Data.Edm.Validation;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Data.Entity.Core.EntityClient;
using System.Data.Entity.Infrastructure;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Reflection;
using System.Text.RegularExpressions;
using System.Xml;
using System.Xml.Linq;

namespace Microsoft.Data.Edm
{
    /// <summary>
    /// DbContext extension that builds an "Entity Data Model" (EDM) from a <see cref="DbContext"/>
    /// created using either Code-First or Model-First.
    /// </summary>
    /// <remarks>
    /// We need the EDM both to define the Web API OData route and as a
    /// source of metadata for the Breeze client. 
    /// <p>
    /// The Web API OData literature recommends the
    /// <see cref="System.Web.Http.OData.Builder.ODataConventionModelBuilder"/>.
    /// That component is suffient for route definition but fails as a source of 
    /// metadata for Breeze because (as of this writing) it neglects to include the
    /// foreign key definitions Breeze requires to maintain navigation properties
    /// of client-side JavaScript entities.
    /// </p><p>
    /// This EDM Builder ask the EF DbContext to supply the metadata which 
    /// satisfy both route definition and Breeze.
    /// </p><p>
    /// This class can be downloaded and installed as a nuget package:
    /// http://www.nuget.org/packages/Breeze.EdmBuilder/
    /// </p>
    /// </remarks>
    public static class EdmBuilder
    {
        /// <summary>
        /// Builds an Entity Data Model (EDM) for a <see cref="DbContext"/> subclass
        /// created using either Code-First or Model-First.
        /// </summary>
        /// <typeparam name="T">
        /// Type of the source <see cref="DbContext"/> with parameterless constructor. 
        /// </typeparam>
        /// <returns>An XML <see cref="IEdmModel"/>.</returns>
        /// <remarks>
        /// The DbContext must have parameterless constructor as this method creates an instance.
        /// If it doesn't, create an instance and pass it to the other
        /// GetEdm overload (or call it as an extension method).
        /// </remarks>
        /// <example>
        /// <![CDATA[
        /// /* In the WebApiConfig.cs */
        /// config.Routes.MapODataRoute(
        ///     routeName: "odata", 
        ///     routePrefix: "odata", 
        ///     model: EdmBuilder.GetEdm<MyDbContext>(), 
        ///     batchHandler: new DefaultODataBatchHandler(GlobalConfiguration.DefaultServer)
        ///     );
        /// ]]>
        /// </example>
        public static IEdmModel GetEdm<T>() where T : DbContext, new()
        {
            return GetEdm(new T());
        }

        /// <summary>
        /// Builds an Entity Data Model (EDM) from an existing <see cref="DbContext"/> instance
        /// created using either Code-First or Model-First (extension method).
        /// </summary>
        /// <typeparam name="T">Type of the source <see cref="DbContext"/></typeparam>
        /// <param name="dbContext">Concrete <see cref="DbContext"/> to use for EDM generation.</param>
        /// <returns>An XML <see cref="IEdmModel"/>.</returns>
        /// <example>
        /// <![CDATA[
        /// /* In the WebApiConfig.cs */
        /// var context = new MyDbContext(arg1, arg2);
        /// config.Routes.MapODataRoute(
        ///     routeName: "odata", 
        ///     routePrefix: "odata", 
        ///     model: context.GetEdm(), // 'GetEdm' called as an extension method
        ///     batchHandler: new DefaultODataBatchHandler(GlobalConfiguration.DefaultServer)
        ///     );
        /// ]]>
        /// </example>
        public static IEdmModel GetEdm<T>(this T dbContext) where T : DbContext
        {
            if (dbContext == null)
            {
                throw new NullReferenceException("dbContext must not be null.");
            }

            // Get internal context
            var internalContext = dbContext
                .GetType()
                .GetProperty(INTERNALCONTEXT, BindingFlags.Instance | BindingFlags.NonPublic)
                ?.GetValue(dbContext);

            // Is code first model?
            var isCodeFirst = internalContext?.GetType()
                .GetProperty(CODEFIRSTMODEL)?.GetValue(internalContext) != null;

            // Return the result based on the dbcontext type
            return isCodeFirst
                ? GetCodeFirstEdm(dbContext)
                : GetModelFirstEdm(dbContext);
        }

        /// <summary>
        /// Builds an Entity Data Model (EDM) from an
        /// existing <see cref="DbContext"/> created using Code-First.
        /// Use <see cref="GetModelFirstEdm{T}"/> for a Model-First DbContext.
        /// </summary>
        /// <typeparam name="T">Type of the source <see cref="DbContext"/></typeparam>
        /// <param name="dbContext">Concrete <see cref="DbContext"/> to use for EDM generation.</param>
        /// <returns>An XML <see cref="IEdmModel"/>.</returns>
        private static IEdmModel GetCodeFirstEdm<T>(this T dbContext) where T : DbContext
        {
            using (var stream = new MemoryStream())
            {
                using (var writer = XmlWriter.Create(stream))
                {
                    System.Data.Entity.Infrastructure.EdmxWriter.WriteEdmx(dbContext, writer);
                }

                stream.Position = 0;

                // Add readonly properties
                // This way of adding new properties actually work, but these properties are not necessary anymore
                // So keep them as a sample
                var edmx = XDocument.Load(stream);
                RemoveProperty(edmx, "User", "SecurityStamp");
                RemoveProperty(edmx, "User", "PasswordHash");
                //AddReadonlyProperty(edmx, "Project", "OtherUsersProjectRateTotal", "Decimal", true);
                //AddReadonlyProperty(edmx, "Project", "OtherUsersProjectRateCount", "Int32", false);

                /* UNCOMMENT THIS IN CASE YOU WANT TO SAVE AND INSPECT THE EDMX FILE */
                //stream.Position = 0;
                //var edmxDocument = new System.Xml.XmlDocument();
                //edmxDocument.Load(stream);
                //edmxDocument.Save(@"D:\test.xml");

                using (var reader = edmx.CreateReader())
                {
                    return Csdl.EdmxReader.Parse(reader);
                }

                // Old part
                //using (var reader = XmlReader.Create(stream))
                //{
                //    return EdmxReader.Parse(reader);
                //}
            }
        }

        private static void AddReadonlyProperty(XDocument edmx, string entityName, string propertyName, string type, bool nullable)
        {
            if (edmx.Root == null) return;

            var entities = edmx
                .Root
                .Elements().First()
                .Elements().First()
                .Elements().First()
                .Elements();

            var element = entities.Single(item => item.Attributes().Any(attr => attr.Name == "Name" && attr.Value == entityName));

            var property = new XElement("{http://schemas.microsoft.com/ado/2009/11/edm}Property");
            property.Add(new XAttribute("Name", propertyName));
            property.Add(new XAttribute("Type", $"Edm.{type}"));
            if (!nullable)
                property.Add(new XAttribute("Nullable", "false"));
            element.Add(property);
        }

        private static void RemoveProperty(XDocument edmx, string entityName, string propertyName)
        {
            if (edmx.Root == null) return;

            var entities = edmx
                .Root
                .Elements().First()
                .Elements().First()
                .Elements().First()
                .Elements();

            var element = entities.Single(item => item.Attributes().Any(attr => attr.Name == "Name" && attr.Value == entityName));
            var property = element.Elements().Single(item => item.Attributes().Any(attr => attr.Name == "Name" && attr.Value == propertyName));
            property.Remove();
        }

        /// <summary>
        /// Builds an Entity Data Model (EDM) from a <see cref="DbContext"/> created using Model-First. 
        /// Use <see cref="GetCodeFirstEdm{T}"/> for a Code-First DbContext.
        /// </summary>
        /// <typeparam name="T">Type of the source <see cref="DbContext"/></typeparam>
        /// <param name="dbContext">Concrete <see cref="DbContext"/> to use for EDM generation.</param>
        /// <returns>An XML <see cref="IEdmModel"/>.</returns>
        /// <remarks>
        /// Inspiration and code for this method came from the following gist
        /// which reates the metadata from an Edmx file:
        /// https://gist.github.com/dariusclay/8673940
        /// </remarks>
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2202:Do not dispose objects multiple times")]
        private static IEdmModel GetModelFirstEdm<T>(this T dbContext) where T : DbContext
        {
            using (var csdlStream = GetCsdlStreamFromMetadata(dbContext))
            {
                using (var reader = XmlReader.Create(csdlStream))
                {
                    IEdmModel model;
                    IEnumerable<EdmError> errors;
                    if (!CsdlReader.TryParse(new[] { reader }, out model, out errors))
                    {
                        foreach (var e in errors)
                            Debug.Fail(e.ErrorCode.ToString("F"), e.ErrorMessage);
                    }
                    return model;
                }
            }
        }

        private static Stream GetCsdlStreamFromMetadata(IObjectContextAdapter context)
        {
            // Get connection string builder
            var connectionStringBuilder = new EntityConnectionStringBuilder(context.ObjectContext.Connection.ConnectionString);

            // Get the regex match from metadata property of the builder
            var match = Regex.Match(connectionStringBuilder.Metadata, METADATACSDLPATTERN);

            // Get the resource name
            var resourceName = match.Groups[0].Value;

            // Get context assembly
            var assembly = Assembly.GetAssembly(context.GetType());

            // Return the csdl resourcey
            return assembly.GetManifestResourceStream(resourceName);
        }

        // Property name in InternalContext class
        private const string CODEFIRSTMODEL = "CodeFirstModel";

        // Property name in DbContext class
        private const string INTERNALCONTEXT = "InternalContext";

        // Pattern to find conceptual model name in connecting string metadata
        private const string METADATACSDLPATTERN = "((\\w+\\.)+csdl)";
    }
}
