using System;
// ReSharper disable InconsistentNaming



namespace DTO
{
    public class CreateOrderFoodDTO
    {
        public string date { get; set; }
        public int sectionId { get; set; }
        public int consumerId { get; set; }
        public int? requesterId { get; set; }
        public string purchaseMethod { get; set; }
    }

    public class UpdateOrderFoodDTO
    {
        public int id { get; set; }
        public string date { get; set; }
        public int sectionId { get; set; }
        public int consumerId { get; set; }
        public int requester { get; set; }
        public string perchaseMethod { get; set; }
    }

    public class AddDetailToOrderFood
    {
        public int id { get; set; }
        public int foodId { get; set; }
        public double qty { get; set; }
        public double price { get; set; }
    }

}
