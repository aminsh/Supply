using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Core;
using Domain.Data;
using Domain.Model;
using DTO;

namespace Domain.Service
{
    public class OrderGoodService
    {
        private readonly IRepository<OrderGood> _orderGoodRepository;
        private readonly IRepository<PurchasingOfficer> _officeRepository; 
        private readonly IResult _result;

        public OrderGoodService(IUnitOfWork unitOfWork, IResult result)
        {
            _orderGoodRepository = unitOfWork.GetRepository<OrderGood>();
            _officeRepository = unitOfWork.GetRepository<PurchasingOfficer>();
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
    }
}
