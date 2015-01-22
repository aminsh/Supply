using System;
using System.Net.Http;
using System.Web.Http;
using System.Web.Mvc;
using System.Web.Routing;
using MvcApplication1.App_Start;
using Newtonsoft.Json.Serialization;
using Web.App_Start;


namespace Web
{
    // Note: For instructions on enabling IIS6 or IIS7 classic mode, 
    // visit http://go.microsoft.com/?LinkId=9394801
    public class MvcApplication : System.Web.HttpApplication
    {
        //void ConfigureCors(CorsConfiguration corsConfig)
        //{
        //    corsConfig
        //        .ForResources(“~/Handler1.ashx”)
        //        .ForOrigins(“http://foo.com&#8221;, “http://bar.com&#8221;)
        //        .AllowAll();
        //}

        protected void Application_Start()
        {
            AreaRegistration.RegisterAllAreas();

            RouteConfig.RegisterRoutes(RouteTable.Routes);
            WebApiConfig.Register(GlobalConfiguration.Configuration);
            FilterConfig.RegisterGlobalFilters(GlobalFilters.Filters);
           

            //ConfigureCors(UrlBasedCorsConfiguration.Configuration);
           
            GlobalConfiguration.Configuration.IncludeErrorDetailPolicy = IncludeErrorDetailPolicy.Always;

            
            
        }
    }

}