using System;
using System.Collections.Generic;
using System.Data.Objects.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DataAccess;
using Model;

namespace BussinessLogic.RequestReview
{
    public class RequestFoodReview
    {
        public Parameters Parameters { get; set; }
        private AppDbContext _context;

        public IQueryable<RequestFood> BaseRequest()
        {
            return _context.RequestFoods.Where(r => !r.HasOrder);
        }

        public IQueryable<RequestX> Sections(int sectionId = 0)
        {
            if (sectionId == 0)
                return _context.Sections.Where(s => s.Parent == null)
                               .Select(s => new RequestX
                               {
                                   Section = s,
                                   Qty =
                                       _context.RequestDetailFoods.Where(
                                           rdg => rdg.RequestFood.Section.FullPathID.StartsWith(
                                               SqlFunctions.StringConvert((double?)s.ID)))
                                               .Sum(r => r.Qty)
                               });
            else
                return _context.Sections.Where(s => s.SectionID == sectionId)
                               .Select(s => new RequestX
                               {
                                   Section = s,
                                   Qty =
                                       _context.RequestDetailFoods.Where(
                                           rdg => rdg.RequestFood.Section.FullPathID.StartsWith(
                                               SqlFunctions.StringConvert((double?)s.ID)))
                                               .Sum(r => r.Qty)
                               });
        }

        public IQueryable<RequestX> Items()
        {
            return BaseRequest().SelectMany(r => r.RequestDetailFoods)
                                .GroupBy(g => g.ItemFood)
                                .Select(g => new RequestX
                                {
                                    Item = g.Key,
                                    Qty = g.Sum(s => s.Qty)
                                });
        }

        public IQueryable<RequestX> SectionsItems(int sectionId = 0)
        {
            if (sectionId == 0)
                return BaseRequest().SelectMany(r => r.RequestDetailFoods)
                                    .Select(rd => new
                                    {
                                        Assistance =
                                                  _context.Sections.FirstOrDefault(
                                                      s =>
                                                      s.Parent == null &&
                                                      rd.RequestFood.Section.FullPathID.StartsWith(
                                                          SqlFunctions.StringConvert((double?)s.ID))),
                                        Item = rd.ItemFood,
                                        TotalQty = rd.Qty
                                    })
                                    .GroupBy(g => new { g.Assistance, g.Item })
                                    .Select(g => new RequestX
                                    {
                                        Section = g.Key.Assistance,
                                        Item = g.Key.Item,
                                        Qty = g.Sum(s => s.TotalQty)
                                    });
            else
                return BaseRequest().SelectMany(r => r.RequestDetailFoods)
                                .Select(rd => new
                                {
                                    Assistance =
                                              _context.Sections.FirstOrDefault(
                                                  s =>
                                                  s.SectionID == sectionId &&
                                                  rd.RequestFood.Section.FullPathID.StartsWith(
                                                      SqlFunctions.StringConvert((double?)s.ID))),
                                    Item = rd.ItemFood,
                                    TotalQty = rd.Qty
                                })
                                .GroupBy(g => new { g.Assistance, g.Item })
                                .Select(g => new RequestX
                                {
                                    Section = g.Key.Assistance,
                                    Item = g.Key.Item,
                                    Qty = g.Sum(s => s.TotalQty)
                                });

        }
    }
}
