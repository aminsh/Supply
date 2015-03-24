using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Core;
using DataAccess.EntityFramework;
using Domain.Model;
using DTO;
using Kendo.DynamicLinq;

namespace DataAccess.Query
{
    public class OrderFoodQuery
    {
        private readonly AppDbContext _context;

        public OrderFoodQuery()
        {
            _context = new AppDbContext();
        }

        public DataSourceResult OrderFoods()
        {
            return null;
        }

        public OrderFoodView OrderFood(int id)
        {
            var orderFood = _context.Set<OrderFood>().Find(id);

            return new OrderFoodView
            {
                id = orderFood.Id,
                date = orderFood.Date,
                isClosed = orderFood.IsClosed,
                closedDate = orderFood.ClosedDate,
                isCancel = orderFood.IsCancel,
                cancelCause = orderFood.CancelCause,
                assignedToOfficerOn = orderFood.AssignedToOfficerOn,
                officerId = orderFood.PurchasingOfficer == null ? null : orderFood.PurchasingOfficer.Id,
                officer = orderFood.PurchasingOfficer == null ? null : orderFood.PurchasingOfficer.Title,
                section = orderFood.Section.Title,
                sectionId = orderFood.Section.Id,
                requester = orderFood.Requester == null ? string.Empty : orderFood.Requester.FirstName + " " + orderFood.Requester.LastName,
                requesterId =  orderFood.Requester == null ? (int?) null : orderFood.Requester.Id,
                consumer = orderFood.ConsumerSection.Title,
                consumerId = orderFood.ConsumerSection.Id,
                purchaseMethod = orderFood.PurchaseMethod.ToString()
            };
        }

        public DataSourceResult Details(int id, DataSourceRequest request)
        {
            return _context.Set<OrderFood>().Find(id)
                .Details.AsQueryable().ToDataSourceResult(request, d => new OrderFoodDetailView
                {
                    id = d.Id,
                    row = d.Row,
                    food = new ServiceView { id = d.Food.Id, title = d.Food.Title, price = d.Food.Price},
                    price = d.Price,
                    qty = d.Qty
                });
        }
    }
}
