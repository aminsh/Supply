using System;
using System.Linq;
using System.Web.Http;
using DataAccess;
using Model;

namespace Web.Controllers
{
    public class Term
    {
        public String Value { get; set; }
    }

    public partial class SupplyController
    {
        private dynamic GetSeasonDay(DateTime date)
        {
            var dayOfYear = date.DayOfYear;

            if (dayOfYear >= 80 && dayOfYear <= 181)
                return new {min = 80, max = 181};
            if (dayOfYear >= 173 && dayOfYear <= 265)
                return new { min = 173, max = 265 };
            if (dayOfYear >= 266 && dayOfYear <= 346)
                return new { min = 266, max = 346 };
            if (dayOfYear >= 325 || dayOfYear <= 52)
                return new { min = 325, max = 52 };

            return new { min = 0, max = 0 };
        }

        [HttpGet]
         public IQueryable<ItemFood> ItemFoodsAdv(String date, String term)
        {
            var context = _contextProvider.Context;
            
             var dayOfRange = GetSeasonDay(DateTime.Parse(date));
             Int32 minday = dayOfRange.min;
             Int32 maxday = dayOfRange.max;
            var itemFood = context.ItemFoods.FirstOrDefault(ifs => ifs.Title.Contains(term));

            IQueryable<ItemFood> itemFoodsBase = term == "empty"
                                                     ? context.ItemFoods.OrderBy(ifs => ifs.ID).Take(10)
                                                     : context.ItemFoods.Where(ifs => ifs.Title.Contains(term))
                                                              .OrderBy(ifs => ifs.ID)
                                                              .Take(10);

            //var requestFoods = context.RequestFoods.Where(r =>
            //                                              SqlFunctions.DatePart("dayofyear", r.Date) >= minday &&
            //                                              SqlFunctions.DatePart("dayofyear", r.Date) <= maxday);

           var requestFoods = context.RequestFoods.AsQueryable();

            if (term != "empty" && itemFood != null)
                requestFoods = requestFoods.Where(r =>
                                                  r.RequestDetailFoods.Any(
                                                      rdf =>
                                                      rdf.ItemFood.Title.Contains(term)));

             var itemFoodsCalculated = context.RequestDetailFoods.Where(
                 rf => requestFoods.Any(r => r.ID == rf.RequestFoodID))
                                              .GroupBy(r => r.ItemFood)
                                              .Select(group => new
                                                  {
                                                      ItemFood = group.Key,
                                                      Count = group.Count()
                                                  }).OrderByDescending(r => r.Count)
                                              .Take(10)
                                              .Select(r => r.ItemFood);
             return
                 itemFoodsBase
                     .Concat(itemFoodsCalculated)
                     .GroupBy(ifs => ifs)
                     .Select(group => group.Key)
                     .IncludeX(ifs => ifs.Scale)
                     .Where(item => item.ParentID == 8 || item.ParentID == 9 || item.ParentID == 40);

           

        } 
    }
    
}