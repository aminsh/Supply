using System.Data.Objects.SqlClient;
using DataAccess;
using Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BussinessLogic.RequestReview
{
    public class RequestGoodReview
    {
        private Parameters Parameters { get; set; }
        private readonly AppDbContext _context;

        public RequestGoodReview(Parameters parameters)
        {
            _context= new AppDbContext();
            Parameters = parameters;
        }
        public IQueryable<RequestGood> BaseRequest()
        {
            return _context.RequestGoods; //.Where(r=> !r.HasOrder);
        }

        public IQueryable<RequestX> Sections(int sectionId = 0)
        {
            if (sectionId == 0)
                return _context.Sections.Where(s => s.Parent == null)
                    .Select(s => new RequestX
                    {
                        Section = s,
                        Qty =
                            _context.RequestDetailGoods.Where(
                                rdg => rdg.RequestGood.Section.FullPathID.Contains(
                                    s.FullPathID))
                                .Sum(r => r.Qty)
                    });
            else
            {
                return _context.Sections.Where(s => s.SectionID == sectionId)
                   .Select(s => new RequestX
                   {
                       Section = s,
                       Qty =
                           _context.RequestDetailGoods.Where(
                               rdg => rdg.RequestGood.Section.FullPathID.Contains(
                                   s.FullPathID))
                               .Sum(r => r.Qty)
                   });
            }
        }

        public IQueryable<RequestX> Items()
        {
            return BaseRequest().SelectMany(r => r.RequestDetailGoods)
                                .GroupBy(g => g.ItemGood)
                                .Select(g => new RequestX
                                    {
                                        Item = g.Key,
                                        Qty = g.Sum(s => s.Qty)
                                    });
        } 

        public IQueryable<RequestX> SectionsItems(int sectionId = 0)
        {
            if(sectionId == 0)
            return BaseRequest().SelectMany(r => r.RequestDetailGoods)
                                .Select(rd => new
                                    {
                                        Assistance =
                                                  _context.Sections.FirstOrDefault(
                                                      s =>
                                                      s.Parent == null &&
                                                      rd.RequestGood.Section.FullPathID.StartsWith(
                                                          s.FullPathID)),
                                        Item = rd.ItemGood,
                                        TotalQty = rd.Qty
                                    })
                                .GroupBy(g => new {g.Assistance, g.Item})
                                .Select(g => new RequestX
                                    {
                                        Section = g.Key.Assistance,
                                        Item = g.Key.Item,
                                        Qty = g.Sum(s => s.TotalQty)
                                    });
            else
                return BaseRequest().SelectMany(r => r.RequestDetailGoods)
                                .Select(rd => new
                                {
                                    Assistance =
                                              _context.Sections.FirstOrDefault(
                                                  s =>
                                                  s.SectionID == sectionId &&
                                                  rd.RequestGood.Section.FullPathID.StartsWith(
                                                      s.FullPathID)),
                                    Item = rd.ItemGood,
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
