using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Http;
using Helper;
using Model;
using System.Data.Objects;

namespace Web.Controllers
{

    public partial class SupplyController
    {
        [HttpGet]
        public IQueryable<RequestService> RequestServicesAdv(string filter)
        {
            var filters = JsonHelper.ConvertToObject<IEnumerable<Filter>>(filter);
            IQueryable<RequestService> source = _contextProvider.Context.RequestServices;
            
            filters.ForEach(f =>
                {
                    if (f.FieldName.ToLower() == "id")
                    {
                        var id = f.Value.Convert<Int32>();
                        source = source.Where(s => s.ID == id);
                    }

                    if (f.FieldName.ToLower() == "periodid")
                    {
                        var periodId = f.Value.Cast<Int32?>();
                        source = source.Where(s => s.PeriodID == periodId);
                    }
                    if (f.FieldName.ToLower() == "no")
                    {
                        var no = f.Value.Convert<int?>();
                        source = source.Where(s => s.OrderNo == no);
                    }
                    if (f.FieldName.ToLower() == "letterdate")
                    {
                        var date = DateTimeHelper.PersianToDateTime(f.Value.ToString());
                        source = source.Where(s => s.LetterRequestServices.Any(l => EntityFunctions.TruncateTime(l.Date) == date));
                    }
                    if (f.FieldName.ToLower() == "letterno")
                    {
                        var no = f.Value.ToString();
                        source = source.Where(s => s.LetterRequestServices.Any(l => l.No.Contains(no)));
                    }
                    if (f.FieldName.ToLower() == "sectionid")
                    {
                        var sentionId = f.Value.Cast<Int32?>();
                        source = source.Where(s => s.SectionID == sentionId);
                    }
                        
                });
            source = source.OrderByDescending(s => s.ID);
            return source;
        }

        [HttpGet]
        public IQueryable<RequestService> RequestServicesExpert()
        {
            return _contextProvider.Context.RequestServices.Where(rs => rs.Status == RequestStatus.Expert);
        }
        
    }
}
