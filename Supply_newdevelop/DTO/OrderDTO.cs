using System;
using System.Collections.Generic;

// ReSharper disable InconsistentNaming
namespace DTO
{
    public class OrderAssignOfficerDTO
    {
        public int id { get; set; }
        public string officerId { get; set; }
        public string date { get; set; }
    }

    public class OrderCloseDTO
    {
        public int id { get; set; }
        public string date { get; set; }
    }

    public class OrderCancelDTO
    {
        public int id { get; set; }
        public string cause { get; set; }
    }

    public class OrderUpdateLetterDTO
    {
        public string number { get; set; }
        public string date { get; set; }
        public int performerId { get; set; }
    }

    public class ExtraConstDTO
    {
        public int costTypeId { get; set; }
        public int cost { get; set; }
    }

    public class UpdateExtraCostDTO
    {
        public int id { get; set; }
        public int detailId { get; set; }
        public IEnumerable<ExtraConstDTO> extraConst { get; set; }  
    }

    public class CostDetailDTO
    {
        public string des { get; set; }
        public double cost { get; set; }
    }

    public class UpdateCostDetailDTO
    {
        public int id { get; set; }
        public int detailId { get; set; }
        public IEnumerable<CostDetailDTO> costDetails { get; set; }  
    }

}
