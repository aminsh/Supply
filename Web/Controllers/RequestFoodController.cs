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
        public IQueryable<RequestFood> RequestFoodsAdv(string filter)
        {
            var filters = JsonHelper.ConvertToObject<IEnumerable<Filter>>(filter);
            IQueryable<RequestFood> source = _contextProvider.Context.RequestFoods;
            
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
                        var date = DateTimeHelper.PersianToDateTime(f.Value.ToString()).Date;
                        source = source.Where(s => s.LetterRequestFoods.Any(l => EntityFunctions.TruncateTime(l.Date) == date));
                    }
                    if (f.FieldName.ToLower() == "letterno")
                    {
                        var no = f.Value.ToString();
                        source = source.Where(s => s.LetterRequestFoods.Any(l => l.No.Contains(no)));
                    }
                    if (f.FieldName.ToLower() == "sectionid")
                    {
                        var sentionId = f.Value.Cast<Int32?>();
                        source = source.Where(s => s.SectionID == sentionId);
                    }
                        
                });
            return source;
        } 

    }
}
