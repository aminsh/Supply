using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web;
using System.Web.Http;
using App.Utility;
using Core;
using DataAccess.Query;
using Domain;
using DTO;
using Kendo.DynamicLinq;

namespace App.Controllers
{
    [RoutePrefix("api/foods")]
    public class FoodController : ApiController
    {
        private readonly FoodService _foodService;
        private readonly IResult _result;

        public FoodController(FoodService foodService,IResult result)
        {
            _foodService = foodService;
            _result = result;
        }

        [Route("")]
        public DataSourceResult Get(HttpRequestMessage request)
        {
            return new FoodQuery().Foods(request.ToDataSourceRequest());
        }

        [Route("{id}")]
        public ServiceView GetById(int id)
        {
            return new FoodQuery().Food(id);
        }
            
        [Route("")]
        public HttpResponseMessage Post(CreateServiceDTO food)
        {
            _foodService.Create(food);
            return Request.ToResponse();
        }

        [Route("")]
        public HttpResponseMessage Put(UpdateServiceDTO food)
        {
            _foodService.Update(food);
            return Request.ToResponse();
        }

        [Route("{id}")]
        public HttpResponseMessage Delete(int id)
        {
            _foodService.Remove(id);
            return Request.ToResponse();
        }
    }
}