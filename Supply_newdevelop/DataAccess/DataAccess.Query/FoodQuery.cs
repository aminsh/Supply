using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Core;
using DataAccess.EntityFramework;
using Domain.Model;
using DTO;
using Kendo.DynamicLinq;

namespace DataAccess.Query
{
    public class FoodQuery
    {
        private readonly AppDbContext _context;

        public FoodQuery()
        {
            _context = new AppDbContext();
        }

        public DataSourceResult Foods(DataSourceRequest request)
        {
            return _context.Set<Food>()
                .OrderBy(f=>f.Id)
                .ToDataSourceResult(request, f => new ServiceView
                {
                    id = f.Id,
                    title = f.Title,
                    price = f.Price,
                    scale = f.Scale.Title
                });
        }

        public ServiceView Food(int id)
        {
            var food = _context.Set<Food>().Find(id);
            return new ServiceView
            {
                id = food.Id,
                title = food.Title,
                price = food.Price,
                des = food.Des,
                scale = food.Scale.Title,
                scaleId = food.Scale.Id
            };
        }
    }
}
