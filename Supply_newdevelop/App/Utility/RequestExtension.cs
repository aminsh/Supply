using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web;
using System.Web.UI.WebControls;
using Core;
using Domain.Data;

namespace App.Utility
{
    public static class RequestExtension
    {
        public static HttpResponseMessage ToResponse(this HttpRequestMessage request)
        {
            var result = DependencyManager.Resolve<IResult>();
            if (result.IsValid)
            {
                var unitOfWork = DependencyManager.Resolve<IUnitOfWork>();
                unitOfWork.Commit();
                return request.CreateResponse();
            }

            var errors = result.Errors.Select(err => new
            {
                propertyName = err.PropertyName,
                message = err.Message
            });

            return request.CreateResponse(HttpStatusCode.BadRequest, errors);
        }
    }
}