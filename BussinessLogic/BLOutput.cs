using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using Model;

namespace BussinessLogic
{
    public class BLOutput : BLBase<Output>
    {
        public override void OnSubmitEntity(Output entity, System.Data.EntityState state, Dictionary<string, object> originalValues)
        {
            var period = Context.Periods.FirstOrDefault(p => p.IsActive);
            if (period == null)
                throw new NullReferenceException("دوره ای تنظیم نشده یا دوره فعال وجود ندارد");

            switch (state)
            {
                case EntityState.Added:
                    {
                        entity.PeriodID = period.ID;
                        entity.CreatedOnDate = DateTime.Now;
                        entity.CreatedByUserID = Context.CurrentUser().ID;

                        var maxNo = Context.Outputs.Where(r => r.PeriodID == period.ID).Max(r => r.No);
                        maxNo = maxNo ?? 0;
                        entity.No = maxNo + 1;
                    }
                    break;
                case EntityState.Modified:
                    {

                    }
                    break;
                case EntityState.Deleted:
                    {

                    }
                    break;
            }

            base.OnSubmitEntity(entity, state, originalValues);
        }

        public Output CreateOutput(RequestGood requestGood,IEnumerable<RequestDetailGood> requestDetailGoods)
        {
            var output = new Output()
            {
                CreatedByUserID = Context.CurrentUser().ID,
                CreatedOnDate = DateTime.Now.Date,
                Date = DateTime.Now.Date,
                SectionID = requestGood.SectionID.Convert<int>(),
                Status = InventoryStatus.Temporary,
                Stock = Context.Stocks.FirstOrDefault(),
                StockID = Context.Stocks.FirstOrDefault().ID,
                RequestGoodID = requestGood.ID
            };

            if (requestGood.PersonID != null)
                output.PersonID = requestGood.PersonID.Cast<Int32>();

            Context.Outputs.Add(output);

            var outputtDetailId = -1;

            requestDetailGoods.ForEach(rd =>
            {
                var outputDetail = new OutputDetail()
                {
                    ID = outputtDetailId--,
                    OutputID = output.ID,
                    ItemGoodID = rd.ItemGoodID,
                    Qty = rd.Qty,
                };

                rd.OutputDetailID = outputDetail.ID;
                Context.OutputDetails.Add(outputDetail);
            });

            return output;
        }
    }
}
