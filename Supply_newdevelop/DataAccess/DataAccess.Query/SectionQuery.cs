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
    public class SectionQuery
    {
        private readonly AppDbContext _context;

        public SectionQuery()
        {
            _context = new AppDbContext();
        }

        public DataSourceResult Sections(DataSourceRequest request)
        {
            return _context.Set<Section>()
                .OrderBy(s => s.Id)
                .ToDataSourceResult(request, s => new KeyValueView
                {
                    id = s.Id,
                    title = s.Title
                });
        }
    }
}
