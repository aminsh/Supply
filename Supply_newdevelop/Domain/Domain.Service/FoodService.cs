using System.Linq;
using Core;
using Domain.Data;
using Domain.Model;
using DTO;

namespace Domain
{
    public class FoodService
    {
        private readonly IRepository<Food> _footRepository;
        private readonly IRepository<OrderFood> _orderFoodRepository;
        private readonly IRepository<Scale> _scaleRepository; 
        private readonly IResult _result;

        public FoodService(IUnitOfWork unitOfWork, IResult result)
        {
            _footRepository = unitOfWork.GetRepository<Food>();
            _orderFoodRepository = unitOfWork.GetRepository<OrderFood>();
            _scaleRepository = unitOfWork.GetRepository<Scale>();
            _result = result;
        }

        public void Create(CreateServiceDTO data)
        {
            var scale = _scaleRepository.FindById(data.scaleId);

            var entity = new Food
            {
                Title = data.title,
                Des = data.des,
                Price = data.price,
                Scale = scale
            };

            _footRepository.Add(entity);
        }

        public void Update(UpdateServiceDTO data)
        {
            var scale = _scaleRepository.FindById(data.scaleId);

            var entity = _footRepository.FindById(data.id);
            entity.Title = data.title;
            entity.Des = data.des;
            entity.Price = data.price;
            entity.Scale = scale;
        }

        public void Remove(int id)
        {
            if (_orderFoodRepository.Query()
                .SelectMany(of => of.Details).Any(d => d.Food.Id == id))
                _result.Errors.Add(new Error
                {
                    Message = "نوع کالای انتخاب شده در سفارش استفاده شده ، امکان خذف آن وجود ندارد"
                });

            var entity = _footRepository.FindById(id);
            _footRepository.Delete(entity);
        }
    }
}
