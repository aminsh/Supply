namespace Domain.Model
{
    public class Vehicle : EntityBase, IItem
    {
        public string Title { get; set; }
        public string Des { get; set; }
        public double Price { get; set; }
        public virtual VehicleBrand VehicleBrand { get; set; }
    }
}
