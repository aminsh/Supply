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

}
