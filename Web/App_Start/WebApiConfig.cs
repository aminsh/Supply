using System.Web.Http;
using Newtonsoft.Json.Serialization;

namespace Web.App_Start
{
    public static class WebApiConfig
    {
        public static void Register(HttpConfiguration config)
        {
            //config.Routes.MapHttpRoute(
            //    name: "DefaultApi",
            //    routeTemplate: "api/{controller}/{id}",
            //    defaults: new { id = RouteParameter.Optional }
            //);


            config.Routes.MapHttpRoute(
                name: "enumRoute",
                routeTemplate: "api/{controller}/{action}/{enumString}",
                defaults: new { enumString = RouteParameter.Optional }
                );

            //config.Routes.MapHttpRoute(
            //    name: "enumRoute",
            //    routeTemplate: "api/{controller}/{action}"
            //    );

            config.EnableQuerySupport();

            ((DefaultContractResolver)config.Formatters.JsonFormatter.SerializerSettings.ContractResolver).IgnoreSerializableAttribute = true;

            var json = config.Formatters.JsonFormatter;
            json.SerializerSettings.PreserveReferencesHandling = Newtonsoft.Json.PreserveReferencesHandling.Objects;
            config.Formatters.Remove(config.Formatters.XmlFormatter);
        }
    }
}
