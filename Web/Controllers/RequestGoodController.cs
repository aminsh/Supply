using System;
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
        public IQueryable<RequestGood> RequestGoodsAdv(string filter)
        {
            var filters = filter.JsonToObject<Filter>();
            IQueryable<RequestGood> source = _contextProvider.Context.RequestGoods;
            
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
                    if (f.FieldName.ToLower() == "nohandy")
                    {
                        //var noHandy = f.Value.ToString();
                        //source = source.Where(s => s.NoHandy.Contains(noHandy));
                    }
                    if (f.FieldName.ToLower() == "letterdate")
                    {
                        var date = DateTimeHelper.PersianToDateTime(f.Value.ToString()).Date;
                        source = source.Where(s => s.LetterRequestGoods.Any(l => EntityFunctions.TruncateTime(l.Date) == date));
                    }
                    if (f.FieldName.ToLower() == "letterno")
                    {
                        var no = f.Value.ToString();
                        source = source.Where(s => s.LetterRequestGoods.Any(l => l.No.Contains(no)));
                    }
                    if (f.FieldName.ToLower() == "sectionid")
                    {
                        var sentionId = f.Value.Cast<Int32?>();
                        source = source.Where(s => s.SectionID == sentionId);
                    }
                       
                });
            return source;
        } 

        [HttpGet]
        public IQueryable<RequestGood> RequestGoodsExpert()
        {
            return _contextProvider.Context.RequestGoods.Where(rg => rg.Status == RequestStatus.Expert);
        }

        [HttpGet]
        public IQueryable<RequestGood> RequestGoodsOrder()
        {
            var beforOrder = new[]
                {
                    RequestStatus.Created, RequestStatus.Cancel, RequestStatus.ConfirmSection, RequestStatus.Expert,
                    RequestStatus.ConfirmManager, RequestStatus.Expert
                };
            return _contextProvider.Context.RequestGoods.Where(rg => !beforOrder.Contains(rg.Status));
        }

        [HttpGet]
        public IQueryable<RequestGood> RequestGoodsOrderDone()
        {
            return
                _contextProvider.Context.RequestGoods.Where(
                    rg => rg.Status == RequestStatus.OrderDone || rg.RequestDetailGoods.Any(rdg => rdg.IsOrder && rdg.DoneDate != null && rdg.InputDetailID == null));
        }

        [HttpGet]
        public IQueryable<RequestGood> RequestGoodsInputDone()
        {
            return
                _contextProvider.Context.RequestGoods.Where(
                    rg =>
                    rg.Status == RequestStatus.InventoryInput || rg.RequestDetailGoods.Any(rdg => rdg.InputDetailID != null && rdg.IsOrder && rdg.OutputDetailID == null));
        } 

    }
}
