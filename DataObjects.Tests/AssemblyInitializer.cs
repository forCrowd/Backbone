using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace forCrowd.Backbone.DataObjects.Tests
{
    [TestClass]
    public static class AssemblyInitializer
    {
        [AssemblyInitialize]
        public static void AssemblyInitialize(TestContext context)
        {
            context.WriteLine("Assembly initializing");

            DatabaseInitializer.Initialize(true);
        }

        [AssemblyCleanup]
        public static void AssemblyCleanup()
        {
        }
    }
}
