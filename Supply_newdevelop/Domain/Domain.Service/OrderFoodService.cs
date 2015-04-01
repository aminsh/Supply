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
    public class OrderFoodService
    {
        private readonly IRepository<OrderFood> _orderFoodRepository;
        private readonly IRepository<Food> _foodRepository;
        private readonly IRepository<Section> _sectionRepository;
        private readonly IRepository<Employee> _employeeRepository; 
        private readonly IRepository<PurchasingOfficer> _officeRepository;
        private readonly IRepository<CostType> _costTypeRepository; 
        private readonly IResult _result;

        public OrderFoodService(IUnitOfWork unitOfWork, IResult result)
        {
            unitOfWork.GetType().GetProperty("temp").SetValue(unitOfWork, "orderService");

            _orderFoodRepository = unitOfWork.GetRepository<OrderFood>();
            _officeRepository = unitOfWork.GetRepository<PurchasingOfficer>();
            _foodRepository = unitOfWork.GetRepository<Food>();
            _costTypeRepository = unitOfWork.GetRepository<CostType>();
            _sectionRepository = unitOfWork.GetRepository<Section>();
            _employeeRepository = unitOfWork.GetRepository<Employee>();

            _result = result;
        }

        public OrderFood Create(CreateOrderFoodDTO data)
        {
            var section = _sectionRepository.FindById(data.sectionId);
            var consumer = _sectionRepository.FindById(data.consumerId);
            Employee requester = null;
            if(data.requesterId != null)
                requester = _employeeRepository.FindById(data.requesterId);

            // assign period
            var entity = new OrderFood
            {
                Date = data.date,
                Section = section,
                ConsumerSection = consumer,
                Requester = requester,
                CreatedBy = null,
                CreatedOn = DateTime.Now.ToPersian()
            };

            _orderFoodRepository.Add(entity);
            return entity;
        }

        public void Update(UpdateOrderFoodDTO data)
        {
            var entity = _orderFoodRepository.FindById(data.id);

            entity.Date = data.date;

            //_orderFoodRepository.Modify(entity);
        }

        public void AssignOfficer(OrderAssignOfficerDTO data)
        {
            var entity = _orderFoodRepository.FindById(data.id);
            var officer = _officeRepository.FindById(data.officerId);

            entity.PurchasingOfficer = officer;
            entity.AssignedToOfficerOn = data.date;

        }

        public void Close(OrderCloseDTO data)
        {
            var entity = _orderFoodRepository.FindById(data.id);

            if (entity.IsCancel)
                _result.Errors.Add(new Error {Message = "سفارش جاری لغو شده"});
            if(entity.IsClosed)
                _result.Errors.Add(new Error { Message = "سفارش جاری قبلا انجام شده است" });
            if(_result.Errors.Any())
                return;

            entity.IsClosed = true;
            entity.ClosedDate = data.date;
        }

        public void UpdateLetter(int id, IEnumerable<OrderUpdateLetterDTO> letters)
        {
            var order = _orderFoodRepository.FindById(id);


            order.Letters.ToList().ForEach(l => l.SetDelete());

            letters.ToList().ForEach(l =>
            {
                var performer = _sectionRepository.FindById(l.performerId);
                var letter = new Letter
                {
                    Date = l.date,
                    Number = l.number,
                    Performer = performer
                };

                order.Letters.Add(letter);
            });
        }

        public void AddDetail(AddDetailToOrderFood data)
        {
            var entity = _orderFoodRepository.FindById(data.id);

            if(entity.IsClosed)
                _result.Errors.Add(new Error{Message = "سفارش جاری به اتمام رسیده"});
            if (entity.IsClosed)
                _result.Errors.Add(new Error { Message = "سفارش جاری قبلا انجام شده است" });
            if (_result.Errors.Any())
                return;


            var row = 1;

            if(entity.Details.Any())
                row = entity.Details.Max(d => d.Row) + 1;

            var food = _foodRepository.FindById(data.foodId);

            var detail = new OrderFoodDetail
            {
                Row = row,
                Food = food,
                Qty = data.qty,
                Price = data.price,
            };

            entity.Details.Add(detail);

        }

        public void UpdateDetail(UpdateDetailToOrderFood data)
        {
            var entity = _orderFoodRepository.FindById(data.id);

            if (entity.IsClosed)
                _result.Errors.Add(new Error { Message = "سفارش جاری به اتمام رسیده" });
            if (entity.IsClosed)
                _result.Errors.Add(new Error { Message = "سفارش جاری قبلا انجام شده است" });
            if (_result.Errors.Any())
                return;

            var detail = entity.Details.FirstOrDefault(d => d.Id == data.detailId);

            if (detail == null)
            {
                 _result.Errors.Add(new Error { Message = "ردیف جاری قبلا پیدا نشد" });
                return;
            }
               
            if (data.foodId != detail.Food.Id)
            {
                var food = _foodRepository.FindById(data.foodId);
                detail.Food = food;
            }

            detail.Qty = data.qty;
            detail.Price = data.price;
        }

        public void DeleteDetail(int id, int detailId)
        {
            var entity = _orderFoodRepository.FindById(id);

            if (entity.IsClosed)
                _result.Errors.Add(new Error { Message = "سفارش جاری به اتمام رسیده" });
            if (entity.IsClosed)
                _result.Errors.Add(new Error { Message = "سفارش جاری قبلا انجام شده است" });
            if (_result.Errors.Any())
                return;

            var detail = entity.Details.FirstOrDefault(d => d.Id == detailId);
            detail.SetDelete();
        }
        public void UpdateExtraCostToDetail(UpdateExtraCostDTO data)
        {
            var detail = _orderFoodRepository
                .FindById(data.id)
                .Details.First(d => d.Id == data.detailId);

            detail.ExtraCosts.ToList().ForEach(cd=>cd.SetDelete());

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
            var detail = _orderFoodRepository
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
