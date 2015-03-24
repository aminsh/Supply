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
    public class EmployeeQuery
    {
        private readonly AppDbContext _context;

        public EmployeeQuery()
        {
            _context = new AppDbContext();
        }

        public DataSourceResult Employees(DataSourceRequest request)
        {
            return _context.Set<Employee>()
                .OrderBy(s => s.Id)
                .Select(e => new KeyValueView
                {
                    id = e.Id,
                    title = e.FirstName + " " + e.LastName
                })
                .ToDataSourceResult(request);
        }
    }
}
