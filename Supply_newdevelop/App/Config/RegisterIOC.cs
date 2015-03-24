using Core;
using DataAccess.EntityFramework;
using Domain;
using Domain.Data;
using Microsoft.Practices.Unity;

namespace App.Config
{
    public static class Ioc
    {
        public static void Register()
        {
            var container = new UnityContainer();
            DependencyManager.Container = container;

            DependencyManager.Register<IUnitOfWork, EntityFrameworkUnitOfWork>(Lifetime.PerRequest);
            DependencyManager.Register<IResult, Result>(Lifetime.PerRequest);

            DependencyManager.Register<FoodService, FoodService>(Lifetime.NewInstance);
            DependencyManager.Register<OrderFoodService, OrderFoodService>(Lifetime.NewInstance);
        }
    }
}