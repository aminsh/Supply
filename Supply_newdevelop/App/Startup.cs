using System;
using System.Threading.Tasks;
using System.Web.Http;
using App.Config;
using App.Utility;
using Core;
using Microsoft.Owin;
using Owin;

[assembly: OwinStartup(typeof(App.Startup))]

namespace App
{
    public class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            var config = new HttpConfiguration();

            config.MapHttpAttributeRoutes();
            
            Ioc.Register();
            config.DependencyResolver = new UnityResolver(DependencyManager.Container);
            
            app.UseWebApi(config);
            app.UseWelcomePage("/Index");
        }
    }
}
