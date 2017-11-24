using System;
using forCrowd.Backbone.BusinessObjects.Entities;

namespace forCrowd.Backbone.DataObjects.Tests
{
    public abstract class BaseTests : IDisposable
    {
        public BackboneContext Context { get; private set; }

        public BaseTests()
        {
            InitializeContext();
        }

        public void InitializeContext()
        {
            Context = new BackboneContext();
        }

        public void Dispose()
        {
            Context.Dispose();
        }
    }
}
