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
using Domain.Data;
using DTO;
using Kendo.DynamicLinq;

namespace App.Controllers
{
    [RoutePrefix("api/orderFoods")]
    public class OrderFoodController : ApiController
    {
        private readonly OrderFoodService _orderFoodService;
        private readonly IResult _result;

        public OrderFoodController(OrderFoodService orderFoodService, IResult result)
        {
            _orderFoodService = orderFoodService;
            _result = result;
        }

        [Route("{id}")]
        [HttpGet]
        public HttpResponseMessage GetById(int id)
        {
            return Request.CreateResponse(new OrderFoodQuery().OrderFood(id));
        }

        [Route("{id}/details")]
        [HttpGet]
        public DataSourceResult Details(int id)
        {
            return new OrderFoodQuery().Details(id, Request.ToDataSourceRequest());
        }

        [Route("{id}/letters")]
        [HttpGet]
        public IEnumerable<LetterView> Letters(int id)
        {
            return new OrderFoodQuery().Letters(id);
        }

        [Route("{id}/details/{detailId}")]
        [HttpGet]
        public HttpResponseMessage GetDetailById(int id, int detailId)
        {
            return Request.CreateResponse(new OrderFoodQuery().GetDetailById(id, detailId));
        }

        [Route("")]
        public HttpResponseMessage Post(CreateOrderFoodDTO orderFood)
        {
            var entity = _orderFoodService.Create(orderFood);

            return Request.ToResponse(entity);
        }
        [Route("")]
        public HttpResponseMessage Put(UpdateOrderFoodDTO orderFood)
        {
            _orderFoodService.Update(orderFood);
            return Request.ToResponse();
        }

        [Route("{id}/assignOfficer")]
        [HttpPut]
        public HttpResponseMessage AssignOfficer(int id , OrderAssignOfficerDTO data)
        {
            data.id = id;
            _orderFoodService.AssignOfficer(data);
            return Request.ToResponse();
        }

        [Route("{id}/close")]
        public HttpResponseMessage Close(int id, string date)
        {
            var closeDto = new OrderCloseDTO {id = id, date = date};
            _orderFoodService.Close(closeDto);
            return Request.ToResponse();
        }

        [Route("{id}/details/")]
        [HttpPost]
        public HttpResponseMessage AddDetail(int id, AddDetailToOrderFood data)
        {
            data.id = id;
            _orderFoodService.AddDetail(data);
            return Request.ToResponse();
        }

        [Route("{id}/details/{detailId}")]
        [HttpPut]
        public HttpResponseMessage AddDetail(int id,int detailId ,UpdateDetailToOrderFood data)
        {
            data.id = id;
            data.detailId = detailId;
            _orderFoodService.UpdateDetail(data);
            return Request.ToResponse();
        }

        [Route("{id}/details/{detailId}")]
        [HttpDelete]
        public HttpResponseMessage RemoveDetail(int id, int detailId)
        {
            _orderFoodService.DeleteDetail(id, detailId);
            return Request.ToResponse();
        }

        [Route("{id}/letters")]
        [HttpPut]
        public HttpResponseMessage UpdateLetters(int id, IEnumerable<OrderUpdateLetterDTO> letter)
        {
            _orderFoodService.UpdateLetter(id , letter);
            return Request.ToResponse();
        }

        [Route("{id}/details/{detailId}/extraCost")]
        [HttpGet]
        public HttpResponseMessage GetExtraCost(int id, int detailId)
        {
            return Request.CreateResponse(new OrderFoodQuery().ExtraCosts(id, detailId));
        }

        [Route("{id}/details/{detailId}/extraCost")]
        [HttpPut]
        public HttpResponseMessage UpdateExtraCost(int id, int detailId, IEnumerable<ExtraConstDTO> extraConst)
        {
            var updateExtraCost = new UpdateExtraCostDTO {id = id, detailId = detailId, extraConst = extraConst};
            _orderFoodService.UpdateExtraCostToDetail(updateExtraCost);
            return Request.ToResponse();
        }

        [Route("{id}/details/{detailId}/costDetail")]
        [HttpGet]
        public HttpResponseMessage GetCostDetail(int id, int detailId)
        {
            return Request.CreateResponse(new OrderFoodQuery().CostDetail(id, detailId));
        }

        [Route("{id}/details/{detailId}/costDetail")]
        [HttpPut]
        public HttpResponseMessage UpdateCostDetail(int id, int detailId, IEnumerable<CostDetailDTO> costDetail)
        {
            var data = new UpdateCostDetailDTO {id = id, detailId = detailId, costDetails = costDetail};
            _orderFoodService.UpdateCostDetail(data);
            return Request.ToResponse();
        }
    }
}