using System;
// ReSharper disable InconsistentNaming
namespace DTO
{
    public class OrderAssignOfficerDTO
    {
        public int id { get; set; }
        public int officerId { get; set; }
        public DateTime date { get; set; }
    }

    public class OrderCloseDTO
    {
        public int id { get; set; }
        public DateTime date { get; set; }
    }

    public class OrderCancelDTO
    {
        public int id { get; set; }
        public string cause { get; set; }
    }
}
