using System;
// ReSharper disable InconsistentNaming
namespace DTO
{
    public class OrderFoodView
    {
        public int id { get; set; }
        public string date { get; set; }
        public bool isClosed { get; set; }
        public string closedDate { get; set; }
        public bool isCancel { get; set; }
        public string cancelCause { get; set; }
        public string officerId { get; set; }
        public string officer { get; set; }
        public int sectionId { get; set; }
        public string section { get; set; }
        public int consumerId { get; set; }
        public string consumer { get; set; }
        public int? requesterId { get; set; }
        public string requester { get; set; }
        public string purchaseMethod { get; set; }
        public string assignedToOfficerOn { get; set; }
    }

    public class OrderFoodDetailView
    {
        public int id { get; set; }
        public int row { get; set; }
        public ServiceView food { get; set; }
        public double qty { get; set; }
        public double price { get; set; }
    }
}
