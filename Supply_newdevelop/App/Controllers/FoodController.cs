using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web;
using System.Web.Http;
using App.Utility;
using Core;
using Domain;
using DTO;

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
        public HttpResponseMessage Get()
        {
           //return Request.CreateResponse(new {name="amin"});
            _result.Errors.Add(new Error{Message = "you cannt do in"});
            return Request.ToResponse();
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