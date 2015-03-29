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
    [RoutePrefix("api")]
    public class BasicInfoController : ApiController
    {
        [Route("costTypes")]
        [HttpGet]
        public DataSourceResult CostTypes()
        {
            return new BasicInfo().CostTypes(Request.ToDataSourceRequest());
        }
    }
}