using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using Breeze.WebApi;
using Model;
using Newtonsoft.Json.Linq;

namespace Web.Controllers
{
    public class SectionController : BreezeBaseController
    {
        [HttpPost]
        public SaveResult SaveChanges(JObject saveBundle)
        {
            return _contextProvider.SaveChanges(saveBundle);
        }

        
    }
}
