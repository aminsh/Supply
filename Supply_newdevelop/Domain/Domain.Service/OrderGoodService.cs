using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Core;
using Domain.Data;
using Domain.Model;
using Domain.Model.Order;
using DTO;

namespace Domain
{
    public class OrderGoodService
    {
        private readonly IRepository<OrderGood> _orderGoodRepository;
        private readonly IRepository<Good> _goodRepository; 
        private readonly IRepository<PurchasingOfficer> _officeRepository;
        private readonly IRepository<CostType> _costTypeRepository; 
        private readonly IResult _result;

        public OrderGoodService(IUnitOfWork unitOfWork, IResult result)
        {
            _orderGoodRepository = unitOfWork.GetRepository<OrderGood>();
            _officeRepository = unitOfWork.GetRepository<PurchasingOfficer>();
            _goodRepository = unitOfWork.GetRepository<Good>();
            _costTypeRepository = unitOfWork.GetRepository<CostType>();
            _result = result;
        }

        public void Create(CreateOrderFoodDTO data)
        {
            // assign period
            var entity = new OrderGood
            {
                Date = data.date
            };

            _orderGoodRepository.Add(entity);
        }

        public void Update(UpdateOrderFoodDTO data)
        {
            var entity = _orderGoodRepository.FindById(data.id);

            entity.Date = data.date;
        }

        public void AssignOfficer(OrderAssignOfficerDTO data)
        {
            var entity = _orderGoodRepository.FindById(data.id);
            var officer = _officeRepository.FindById(data.officerId);

            entity.PurchasingOfficer = officer;
            entity.AssignedToOfficerOn = data.date;

        }

        public void Close(OrderCloseDTO data)
        {
            var entity = _orderGoodRepository.FindById(data.id);

            if (entity.IsCancel)
                _result.Errors.Add(new Error { Message = "سفارش جاری لغو شده" });
            if (entity.IsClosed)
                _result.Errors.Add(new Error { Message = "سفارش جاری قبلا انجام شده است" });
            if (_result.Errors.Any())
                return;

            entity.IsClosed = true;
            entity.ClosedDate = data.date;
        }

        public void AddDetail(AddDetailToOrderFood data)
        {
            var entity = _orderGoodRepository.FindById(data.id);

            if (entity.IsClosed)
                _result.Errors.Add(new Error { Message = "سفارش جاری به اتمام رسیده" });
            if (entity.IsClosed)
                _result.Errors.Add(new Error { Message = "سفارش جاری قبلا انجام شده است" });
            if (_result.Errors.Any())
                return;

            var row = entity.Details.Max(d => d.Row) + 1;
            var good = _goodRepository.FindById(data.foodId);

            var detail = new OrderGoodDetail
            {
                Row = row,
                Good = good,
                Qty = data.qty,
                Price = data.price,
            };

            entity.Details.Add(detail);

        }

        public void UpdateExtraCostToDetail(UpdateExtraCostDTO data)
        {
            var detail = _orderGoodRepository
                .FindById(data.id)
                .Details.First(d => d.Id == data.detailId);

            detail.ExtraCosts.ToList().ForEach(cd => cd.SetDelete());

            data.extraConst.ToList().ForEach(ec =>
            {
                var costType = _costTypeRepository.FindById(ec.costTypeId);

                var extraCost = new ExtraCost
                {
                    CostType = costType,
                    Cost = ec.cost
                };

                detail.ExtraCosts.Add(extraCost);
            });
        }

        public void UpdateCostDetail(UpdateCostDetailDTO data)
        {
            var detail = _orderGoodRepository
                .FindById(data.id)
                .Details.First(d => d.Id == data.detailId);

            detail.CostDetails.ToList().ForEach(cd => cd.SetDelete());

            data.costDetails.ToList().ForEach(cd =>
            {
                var costDetail = new CostDetail
                {
                    Des = cd.des,
                    Cost = cd.cost
                };

                detail.CostDetails.Add(costDetail);
            });
        }
    }
}
