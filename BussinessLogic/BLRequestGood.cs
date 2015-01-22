using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using Model;

namespace BussinessLogic
{
    public class BLRequestGood : BLBase<RequestGood>
    {
        public override void OnSubmitEntity(RequestGood entity, EntityState state, Dictionary<string, object> originalValues)
        {
            var currentperiod = Context.Periods.FirstOrDefault(p => p.IsActive);
            if(currentperiod == null)
                throw new NullReferenceException("دوره ای تنظیم نشده یا دوره فعال وجود ندارد");

            if (entity.PurchasingOfficerID != null && entity.OrderDate == null)
                throw new ValidationExceptionX("تاریخ ارائه به کارپرداز الزامی است", null)
                {
                    BadProp = "OrderDate",
                    EntityInError = entity
                };
            if (entity.PurchasingOfficerID == null && entity.OrderDate != null)
                throw new ValidationExceptionX("کارپرداز الزامی است", null)
                {
                    BadProp = "PurchasingOfficerID",
                    EntityInError = entity
                };

            switch (state)
            {
                case EntityState.Added:
                    {
                        entity.CreatedByUserID = Context.CurrentUser().ID;
                        entity.PeriodID = currentperiod.ID;

                        //این قسمت بدلیل اینکه هنوز در کل سازمان پیاده سازی نشده است در نظر گرفته شده است
                        //entity.Status = RequestStatus.Expert;
                        //-------------------------------------------------------------------------------------------

                        //Generate RequestGoodNo  شماره درخواست کالا
                        var maxNo =
                            Context.RequestGoods.Where(r => r.PeriodID == currentperiod.ID).Max(r => r.RequestGoodNo);
                        maxNo = maxNo ?? 0;
                        entity.RequestGoodNo = maxNo + 1;


                        //Generate OrderNo  شماره سفارش خرید
                        if (entity.HasOrder)
                        {
                            maxNo = Context.Requests.Where(r => r.PeriodID == currentperiod.ID).Max(r => r.OrderNo);
                            maxNo = maxNo ?? 0;
                            entity.OrderNo = maxNo + 1;
                        }

                        //وارد کارتابل کردن درخواست جاری
                        (new BLRequestStep() { Context = Context }).FirstStep(entity.ID);
                        
                    }
                    break; 
                case EntityState.Modified:
                    {
                        // Remove Request procedure 
                        if (entity.Status == RequestStatus.Cancel)
                            entity.OrderNo = entity.ID * -1;
                        //var lastStatus = GetOrginalValue(originalValues, ov => ov.Status).As<RequestStatus>();

                        //Generate OrderNo  شماره سفارش خرید
                        var lastHasOrder = GetOrginalValue(originalValues, ov => ov.HasOrder).Cast<Boolean>();

                        if (!lastHasOrder && entity.HasOrder)
                        {
                            var maxNo = Context.Requests.Where(r => r.PeriodID == currentperiod.ID).Max(r => r.OrderNo);
                            maxNo = maxNo ?? 0;
                            entity.OrderNo = maxNo + 1;
                        }

                        if (entity.PurchasingOfficerID != null)
                        {
                            if (entity.Status == RequestStatus.Order)
                                entity.Status = RequestStatus.PurchasingOfficer;
                        }
                    }
                    break;
                case EntityState.Deleted:
                    {
                        Context.Entry(entity).State = EntityState.Modified;
                        entity.Status = RequestStatus.Cancel;
                        
                    }
                    break;
            }

            base.OnSubmitEntity(entity, state, originalValues);
        }

        public void CreateInputInvertory(RequestGood entity, Dictionary<string, object> orginalValues)
        {
            var empId = Context.PurchasingOfficers.FirstOrDefault(po => po.ID == entity.PurchasingOfficerID).EmployeeID;
            
            var input = new Input()
            {
                CreatedByUserID = Context.CurrentUser().ID,
                CreatedOnDate = DateTime.Now.Date,
                Date = DateTime.Now.Date,
                SectionID = entity.SectionID.Convert<int>(),
                Status = InventoryStatus.Temporary,
                Stock = Context.Stocks.FirstOrDefault(),
                RequestGoodID = entity.ID,
                PersonID = empId
            };

            Context.Inputs.Add(input);

            var requestDetails =
                Context.RequestDetailGoods.Where(
                    rdg => rdg.RequestGoodID == entity.ID && rdg.IsOrder && rdg.DoneDate != null && rdg.InputDetailID == null);

            requestDetails.ForEach(rd =>
            {
                var inputDetail = new InputDetail()
                {
                    InputID = input.ID,
                    ItemGoodID = rd.ItemGoodID,
                    Qty = rd.Qty,
                    RequestGoodID = entity.ID
                };

                Context.InputDetails.Add(inputDetail);
                rd.InputDetailID = inputDetail.ID;
            });
        }

        public void CreateOutputInventory(RequestGood entity, Dictionary<string, object> orginalvalues)
        {
            var output = new Output()
                {
                    CreatedByUserID = Context.CurrentUser().ID,
                    CreatedOnDate = DateTime.Now.Date,
                    Date = DateTime.Now.Date,
                    SectionID = entity.SectionID.Convert<int>(),
                    Status = InventoryStatus.Temporary,
                    PersonID = Context.People.FirstOrDefault().ID, //
                    Stock = Context.Stocks.FirstOrDefault(),
                    StockID = Context.Stocks.FirstOrDefault().ID,
                    RequestGoodID = entity.ID
                };

            Context.Outputs.Add(output);

            var requestDetails =
                Context.RequestDetailGoods.Where(
                    rdg => rdg.RequestGoodID == entity.ID && ((rdg.IsOrder && rdg.DoneDate != null && rdg.OutputDetailID == null) || (!rdg.IsOrder)));

            requestDetails.ForEach(rd =>
            {
                var outputDetail = new OutputDetail()
                {
                    OutputID = output.ID,
                    ItemGoodID = rd.ItemGoodID,
                    Qty = rd.Qty,
                };

                rd.OutputDetailID = outputDetail.ID;
                Context.OutputDetails.Add(outputDetail);
            });
        }
    }
}
