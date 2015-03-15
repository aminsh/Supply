using Core;
using Domain.Data;
using Domain.Model;
using DTO;

namespace Domain
{
    public class VehicleService
    {
        private readonly IRepository<Vehicle> _vehicleRepository;
        private readonly IRepository<VehicleBrand> _vehicleBrandRepository; 
        private readonly IResult _result;

        public VehicleService(IUnitOfWork unitOfWork, IResult result)
        {
            _vehicleRepository = unitOfWork.GetRepository<Vehicle>();
            _vehicleBrandRepository = unitOfWork.GetRepository<VehicleBrand>();
            _result = result;
        }

        public void Create(CreateVehicleDTO data)
        {
            var brand = _vehicleBrandRepository.FindById(data.vehicleBrandId);
            var entity = new Vehicle
            {
                Title = data.title,
                Des = data.des,
                Price = data.price,
                VehicleBrand = brand
            };

            _vehicleRepository.Add(entity);
        }

        public void Update(UpdateVehicleDTO data)
        {
            var brand = _vehicleBrandRepository.FindById(data.vehicleBrandId);
            var entity = _vehicleRepository.FindById(data.id);
            entity.Title = data.title;
            entity.Des = data.des;
            entity.Price = data.price;
            entity.VehicleBrand = brand;
        }

        public void Remove(int id)
        {
            _vehicleRepository.DeleteById(id);
        }
    }
}
