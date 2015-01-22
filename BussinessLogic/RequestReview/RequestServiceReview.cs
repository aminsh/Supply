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
    public class RequestServiceReview
    {
        public Parameters Parameters { get; set; }
        private AppDbContext _context;

        public IQueryable<RequestService> BaseRequest()
        {
            return _context.RequestServices.Where(r=> !r.HasOrder);
        }

        public IQueryable<RequestX> Sections(int sectionId = 0)
        {
            if (sectionId == 0)
                return _context.Sections.Where(s => s.Parent == null)
                               .Select(s => new RequestX
                                   {
                                       Section = s,
                                       Qty =
                                           _context.RequestDetailServices.Where(
                                               rdg => rdg.RequestService.Section.FullPathID.StartsWith(
                                                   SqlFunctions.StringConvert((double?) s.ID)))
                                                   .Sum(r => r.Qty)
                                   });
            else
                return _context.Sections.Where(s => s.SectionID == sectionId)
                               .Select(s => new RequestX
                                   {
                                       Section = s,
                                       Qty =
                                           _context.RequestDetailServices.Where(
                                               rdg => rdg.RequestService.Section.FullPathID.StartsWith(
                                                   SqlFunctions.StringConvert((double?) s.ID)))
                                                   .Sum(r => r.Qty)
                                   });
        }

        public IQueryable<RequestX> Items()
        {
            return BaseRequest().SelectMany(r => r.RequestDetailServices)
                                .GroupBy(g => g.ItemService)
                                .Select(g => new RequestX
                                    {
                                        Item = g.Key,
                                        Qty = g.Sum(s => s.Qty)
                                    });
        } 

        public IQueryable<RequestX> SectionsItems(int sectionId = 0)
        {
            if(sectionId == 0)
            return BaseRequest().SelectMany(r => r.RequestDetailServices)
                                .Select(rd => new
                                    {
                                        Assistance =
                                                  _context.Sections.FirstOrDefault(
                                                      s =>
                                                      s.Parent == null &&
                                                      rd.RequestService.Section.FullPathID.StartsWith(
                                                          SqlFunctions.StringConvert((double?) s.ID))),
                                        Item = rd.ItemService,
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
                return BaseRequest().SelectMany(r => r.RequestDetailServices)
                                .Select(rd => new
                                {
                                    Assistance =
                                              _context.Sections.FirstOrDefault(
                                                  s =>
                                                  s.SectionID == sectionId &&
                                                  rd.RequestService.Section.FullPathID.StartsWith(
                                                      SqlFunctions.StringConvert((double?)s.ID))),
                                    Item = rd.ItemService,
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
