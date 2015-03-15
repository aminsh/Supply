// ReSharper disable InconsistentNaming
namespace DTO
{
    
    public class CreateVehicleDTO
    {
        public string title { get; set; }
        public string des { get; set; }
        public double price { get; set; }
        public int vehicleBrandId { get; set; }
    }

    public class UpdateVehicleDTO
    {
        public int id { get; set; }
        public string title { get; set; }
        public string des { get; set; }
        public double price { get; set; }
        public int vehicleBrandId { get; set; }
    }
}
