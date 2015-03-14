using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Domain.Data;
using Domain.Model;
using DTO;

namespace Domain
{
    public class ServiceService
    {
        private readonly IRepository<Service> _serviceRepository;

        public ServiceService(IRepository<Service> serviceRepository)
        {
            _serviceRepository = serviceRepository;
        }

        public void Create(CreateServiceDTO data)
        {
            var entity = new Service
            {
                Title = data.title,
                Des = data.des,
                Price = data.price
            };

            _serviceRepository.Add(entity);
        }

        public void Update(UpdateServiceDTO data)
        {
            var entity = _serviceRepository.FindById(data.id);
            entity.Title = data.title;
            entity.Des = data.des;
            entity.Price = data.price;
        }

        public void Remove(int id)
        {
            var entity = _serviceRepository.FindById(id);
            _serviceRepository.Delete(entity);
        }
    }
}
