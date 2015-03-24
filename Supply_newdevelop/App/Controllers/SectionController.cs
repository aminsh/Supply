using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Http;
using App.Utility;
using DataAccess.Query;
using Kendo.DynamicLinq;

namespace App.Controllers
{
    [RoutePrefix("api/sections")]
    public class SectionController : ApiController
    {
        [Route("")]
        public DataSourceResult Get()
        {
            return new SectionQuery().Sections(Request.ToDataSourceRequest());
        }
    }
}