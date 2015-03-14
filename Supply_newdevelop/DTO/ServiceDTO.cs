using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DTO
{

    public class CreateServiceDTO
    {
        public string title { get; set; }
        public string des { get; set; }
        public double price { get; set; }
    }

    public class UpdateServiceDTO
    {
        public int id { get; set; }
        public string title { get; set; }
        public string des { get; set; }
        public double price { get; set; }
    }
}
