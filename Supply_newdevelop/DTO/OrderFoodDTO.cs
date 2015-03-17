using System;
// ReSharper disable InconsistentNaming



namespace DTO
{
    public class CreateOrderFoodDTO
    {
        public DateTime date { get; set; }
    }

    public class UpdateOrderFoodDTO
    {
        public int id { get; set; }
        public DateTime date { get; set; }
    }

    public class AddDetailToOrderFood
    {
        public int id { get; set; }
        public int foodId { get; set; }
        public double qty { get; set; }
        public double price { get; set; }
    }

}
