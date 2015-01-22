using System.Collections.Generic;
using System.Web.Http;
using Helper;
using Helper.MyHelper;
using Helper.Reflection;
using Model;

namespace Web.Controllers
{
    public class EnumController : ApiController
    {
        [HttpGet]
        [AllowAnonymous]
        public IEnumerable<EnumX> GetEnums([FromUri] string enumString)
        {
            var type = ReflectionHelper.GetTypeFromString<Entity>("Model." + enumString.ToPascalCase());
            return EnumHelper.GetEnumXs(enumString, type);
            
        }
    }
}
