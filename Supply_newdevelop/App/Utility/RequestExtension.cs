using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web;
using System.Web.UI.WebControls;
using Core;
using Domain.Data;
using Kendo.DynamicLinq;
using Newtonsoft.Json;

namespace App.Utility
{
    public static class RequestExtension
    {
        public static HttpResponseMessage ToResponse(this HttpRequestMessage request, object data = null)
        {
            var result = DependencyManager.Resolve<IResult>();
            if (result.IsValid)
            {
                var unitOfWork = DependencyManager.Resolve<IUnitOfWork>();
                unitOfWork.Commit();
                return request.CreateResponse(data);
            }

            var errors = result.Errors.Select(err => new
            {
                propertyName = err.PropertyName,
                message = err.Message
            });

            return request.CreateResponse(HttpStatusCode.BadRequest, errors);
        }

        
        public static DataSourceRequest ToDataSourceRequest(this HttpRequestMessage request)
        {
            try
            {
                return JsonConvert.DeserializeObject<DataSourceRequest>(
                    request.RequestUri.ParseQueryString().GetKey(0)
                    );
            }
            catch (Exception e)
            {
                return new DataSourceRequest();
            }
        }
    }
}