using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using Model;

namespace BussinessLogic
{
    public class BLInput : BLBase<Input>
    {
        public override void OnSubmitEntity(Input entity, System.Data.EntityState state, Dictionary<string, object> originalValues)
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

                        var maxNo = Context.Inputs.Where(r => r.PeriodID == period.ID).Max(r => r.No);
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

        public Input CreateInput(RequestGood requestGood, IEnumerable<RequestDetailGood> requestDetails)
        {
            var input = new Input()
            {
                CreatedByUserID = Context.CurrentUser().ID,
                CreatedOnDate = DateTime.Now.Date,
                Date = DateTime.Now.Date,
                SectionID = requestGood.SectionID.Convert<int>(),
                Status = InventoryStatus.Temporary,
                Stock = Context.Stocks.FirstOrDefault(),
                RequestGoodID = requestGood.ID,
                PersonID = requestGood.PurchasingOfficer.EmployeeID
            };

            Context.Inputs.Add(input);

            var inputDetailId = -1;
            requestDetails.ForEach(rd =>
            {
                var inputDetail = new InputDetail()
                {
                    ID = inputDetailId--,
                    InputID = input.ID,
                    ItemGoodID = rd.ItemGoodID,
                    Qty = rd.Qty,
                    RequestGoodID = requestGood.ID
                };

                Context.InputDetails.Add(inputDetail);
                rd.InputDetailID = inputDetail.ID;
            });

            return input;
        }
    }
}
