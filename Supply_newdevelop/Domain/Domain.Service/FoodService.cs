using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Core;
using Domain.Data;
using Domain.Model;
using DTO;

namespace Domain
{
    public class FoodService
    {
        private readonly IRepository<Food> _footRepository;
        private readonly IResult _result;

        public FoodService(IUnitOfWork unitOfWork, IResult result)
        {
            _footRepository = unitOfWork.GetRepository<Food>();
            _result = result;
        }

        public void Create(CreateServiceDTO data)
        {
            var entity = new Food
            {
                Title = data.title,
                Des = data.des,
                Price = data.price
            };

            _footRepository.Add(entity);
        }

        public void Update(UpdateServiceDTO data)
        {
            var entity = _footRepository.FindById(data.id);
            entity.Title = data.title;
            entity.Des = data.des;
            entity.Price = data.price;
        }

        public void Remove(int id)
        {
            var entity = _footRepository.FindById(id);
            _footRepository.Delete(entity);
        }
    }
}
