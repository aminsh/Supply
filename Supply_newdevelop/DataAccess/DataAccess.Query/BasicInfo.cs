using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Core;
using DataAccess.EntityFramework;
using Domain.Model;
using Domain.Model.Order;
using DTO;
using Kendo.DynamicLinq;

namespace DataAccess.Query
{
    public class BasicInfo
    {
        private readonly AppDbContext _context;

        public BasicInfo()
        {
            _context = new AppDbContext();
        }

        public DataSourceResult Scales(DataSourceRequest request)
        {
            return _context.Set<Scale>()
                .ToDataSourceResult(request, scale => new KeyValueView
                {
                    id = scale.Id,
                    title = scale.Title
                });
        }

        public DataSourceResult CostTypes(DataSourceRequest request)
        {
            return _context.Set<CostType>()
                .ToDataSourceResult(request, type => new 
                {
                    id = type.Id,
                    title = type.Title,
                    nature = type.NatureCost == NatureCost.Positive ? 1 : -1
                });
        }
    }
}
