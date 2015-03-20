using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Web;
using System.Web.Http;
using App.Utility;
using DataAccess.Query;
using DTO;
using Kendo.DynamicLinq;

namespace App.Controllers
{
    [RoutePrefix("api/scales")]
    public class ScaleController : ApiController
    {
        [Route("")]
        public DataSourceResult Get(HttpRequestMessage request)
        {

            return new BasicInfo().Scales(request.ToDataSourceRequest());
        }
    }
}