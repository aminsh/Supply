using System;
using Microsoft.Practices.Unity;

namespace Core
{
    public static class DependencyManager
    {
        public static IUnityContainer Container { get; set; }
        
        
        public static void Register<TFrom, TTo>(Lifetime lifetime) where TTo : TFrom
        {
            Container.RegisterType<TFrom, TTo>(GetLifetimeManager(lifetime));
        }
        public static T Resolve<T>() where T : class
        {
            return Container.Resolve<T>();
        }

        public static object Resolve(Type type)
        {
            return Resolve(type);
        }

        private static LifetimeManager GetLifetimeManager(Lifetime lifetime)
        {
            if(lifetime == Lifetime.NewInstance)
                return  new TransientLifetimeManager();
            if(lifetime == Lifetime.Singletone)
                return new ContainerControlledLifetimeManager();
            if(lifetime == Lifetime.PerRequest)
                return new PerThreadLifetimeManager();
            return null;
        }
    }

    public enum Lifetime
    {
        NewInstance,
        Singletone,
        PerRequest
    }
}