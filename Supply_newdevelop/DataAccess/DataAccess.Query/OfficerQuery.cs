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
    public class OfficerQuery
    {
        private readonly AppDbContext _context;

        public OfficerQuery()
        {
            _context = new AppDbContext();
        }

        public DataSourceResult Officers(DataSourceRequest request)
        {
            return _context.Set<PurchasingOfficer>().AsQueryable().ToDataSourceResult(request, o => new
            {
                id = o.Id,
                title = o.Title
            });
        }
    }
}
