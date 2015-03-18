using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DataAccess.EntityFramework;
using Domain.Model;
using DTO;

namespace DataAccess.Query
{
    public class FoodQuery
    {
        private readonly AppDbContext _context;

        public FoodQuery()
        {
            _context = new AppDbContext();
        }

        public IEnumerable<ServiceView> Foods()
        {
            return _context.Set<Food>()
                .ToList()
                .Select(f => new ServiceView
            {
                id = f.Id,
                title = f.Title,
                price = f.Price
            });
        }
    }
}
