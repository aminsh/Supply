using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Web.Http;
using Helper;
using Model;

namespace Web.Controllers
{

    public partial class SupplyController
    {
        [AllowAnonymous]
        [HttpGet]
        public object[] TotalRequestsForSection(string filter)
        {
            var filters = JsonHelper.ConvertToObject<IEnumerable<Filter>>(filter);
            var source = new List<object>();

            var sectionFilter = filters.FirstOrDefault(item => item.FieldName.ToLower() == "sectionid");
            if (sectionFilter != null)
            {
                var sectionId = sectionFilter.Value.Cast<int>();
                var count =
                    _contextProvider.Context.RequestGoods.Count(
                        rg => rg.SectionID == sectionId && rg.Status == RequestStatus.Created);

                source.Add(new {Name = "Good", Title = "کالا", Count = count});

                count =
                    _contextProvider.Context.RequestServices.Count(
                        rg => rg.SectionID == sectionId && rg.Status == RequestStatus.Created);

                source.Add(new { Name = "Service", Title = "خدمات", Count = count });


                count =
                    _contextProvider.Context.RequestFoods.Count(
                        rg => rg.SectionID == sectionId && rg.Status == RequestStatus.Created);

                source.Add(new { Name = "Food", Title = "میوه و شیرینی", Count = count });

                count =
                    _contextProvider.Context.RequestTickets.Count(
                        rg => rg.SectionID == sectionId && rg.Status == RequestStatus.Created);

                source.Add(new { Name = "Ticket", Title = "بلیط های مسافرتی", Count = count });


                count =
                    _contextProvider.Context.RequestVehicles.Count(
                        rg => rg.SectionID == sectionId && rg.Status == RequestStatus.Created);

                source.Add(new { Name = "Vehicle", Title = "تعمیرات نقلیه", Count = count });
            }

            return source.ToArray();
        }

        [AllowAnonymous]
        [HttpGet]
        public object[] TotalRequestsForSupplyManager()
        {
            var source = new List<object>();

                var count =
                    _contextProvider.Context.RequestGoods.Count(
                        rg => rg.Status == RequestStatus.ConfirmSection);

                source.Add(new { Name = "Good", Title = "کالا", Count = count });

                count =
                    _contextProvider.Context.RequestServices.Count(
                        rg => rg.Status == RequestStatus.ConfirmSection);

                source.Add(new { Name = "Service", Title = "خدمات", Count = count });


                count =
                    _contextProvider.Context.RequestFoods.Count(
                        rg => rg.Status == RequestStatus.ConfirmSection);

                source.Add(new { Name = "Food", Title = "میوه و شیرینی", Count = count });

                count =
                    _contextProvider.Context.RequestTickets.Count(
                        rg => rg.Status == RequestStatus.ConfirmSection);

                source.Add(new { Name = "Ticket", Title = "بلیط های مسافرتی", Count = count });


                count =
                    _contextProvider.Context.RequestVehicles.Count(
                        rg => rg.Status == RequestStatus.ConfirmSection);

                source.Add(new { Name = "Vehicle", Title = "تعمیرات نقلیه", Count = count });
            

            return source.ToArray();
        } 

        [AllowAnonymous]
        [HttpGet]
        public object[] TotalRequests()
        {
            var source = new List<object>();
            var context = _contextProvider.Context;
            var userId = context.CurrentUser().ID;
            var dictionary = new Dictionary<string, string>
                {
                    {"Good", "کالا"},
                    {"Service", "خدمات"},
                    {"Food", "میوه وشیرینی"},
                    {"Ticket", "بلیط های مسافرتی"},
                    {"Vehicle", "تعمیرات نقلیه"}
                };

            return 
// ReSharper disable CoVariantArrayConversion
                _contextProvider.Context.RequestSteps.Where(
                    rs =>
                    (rs.Status == StepStatus.New && rs.Step.HandlerUsers.Any(hu => hu.UserID == userId)) ||
                    (rs.Status == StepStatus.InProgress && rs.HandlerUserID == userId)
                    ).Include("Request")
                    .ToList()
                    .GroupBy(g => g.Request.GetType())
                    .Select(g => new
                    {
                        Name = g.Key.Name.Replace("Request",""),
                        Title = dictionary.First(d=>d.Key == g.Key.Name.Replace("Request","")).Value,
                        InProgCount = g.Count(r=>r.Status == StepStatus.InProgress),
                        NewCount = g.Count(r => r.Status == StepStatus.New),
                    }).ToArray();
// ReSharper restore CoVariantArrayConversion
        }  
    }
}
