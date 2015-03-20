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
    }
}
