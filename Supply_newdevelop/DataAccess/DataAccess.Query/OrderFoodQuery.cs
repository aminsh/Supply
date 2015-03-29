using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Core;
using DataAccess.EntityFramework;
using Domain.Model;
using Domain.Model.Order;
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
                    scale = d.Food.Scale.Title,
                    price = d.Price * d.Qty,
                    qty = d.Qty
                });
        }

        public OrderFoodDetailView GetDetailById(int id, int detailId)
        {
            var detail = _context.Set<OrderFood>().Find(id).Details.First(d => d.Id == detailId);

            return new OrderFoodDetailView
            {
                id = detail.Id,
                row = detail.Row,
                food = new ServiceView { id = detail.Food.Id, title = detail.Food.Title, price = detail.Food.Price },
                scale = detail.Food.Scale.Title,
                price = detail.Price * detail.Qty,
                qty = detail.Qty
            };
        }

        public IEnumerable<LetterView> Letters(int id)
        {
            var orderFood = _context.Set<OrderFood>().Find(id);

            return orderFood.Letters.ToList().Select(l => new LetterView
            {
                number = l.Number,
                date = l.Date,
                performer = l.Performer == null ? string.Empty : l.Performer.Title,
                performerId = l.Performer == null ? (int?) null : l.Performer.Id
            });
        }

        public IEnumerable<object> ExtraCosts(int id, int detailId)
        {
            var detail = _context.Set<OrderFood>().Find(id).Details.First(d => d.Id == detailId);

            return detail.ExtraCosts.ToList().Select(e => new
            {
                cost = e.Cost,
                costTypeId = e.CostType.Id,
                costType = e.CostType.Title,
                nature = e.CostType.NatureCost == NatureCost.Positive ? 1 : -1
            });
        }

        public IEnumerable<object> CostDetail(int id, int detailId)
        {
            var detail = _context.Set<OrderFood>().Find(id).Details.First(d => d.Id == detailId);

            return detail.CostDetails.ToList().Select(c => new
            {
                des = c.Des,
                cost = c.Cost
            });
        }
    }
}
