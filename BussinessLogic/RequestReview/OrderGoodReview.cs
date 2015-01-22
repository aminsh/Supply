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
    public class OrderGoodReview
    {
        private Parameters Parameters { get; set; }

        private AppDbContext Context { get; set; }

        public OrderGoodReview(AppDbContext context,Parameters parameters)
        {
            Context = context;
            Parameters = parameters;
        }

        public IQueryable<RequestGood> BaseRequest()
        {
            var baseQuery = Context.RequestGoods.Where(r => r.HasOrder);

            if (Parameters.StartDate != null)
                baseQuery = baseQuery.Where(r => r.Date >= Parameters.StartDate);
            if (Parameters.EndDate != null)
                baseQuery = baseQuery.Where(r => r.Date >= Parameters.EndDate);

            if (Parameters.Letter != null)
                baseQuery = baseQuery.Where(r => r.LetterRequestGoods.Any(l=> l.ID == Parameters.Letter.ID));

            if (Parameters.Section != null)
                baseQuery = baseQuery.Where(r => r.Section.ID == Parameters.Section.ID);

            if (Parameters.OrderStatus == OrderStatus.Pending)
                baseQuery = baseQuery.Where(r => r.RequestDetailGoods.All(rdg => rdg.DoneDate != null));
            if (Parameters.OrderStatus == OrderStatus.Done)
                baseQuery = baseQuery.Where(r => r.RequestDetailGoods.All(rdg => rdg.DoneDate == null));

            return baseQuery;  
        }

        public IQueryable<RequestX> Sections(Section section = null)
        {
            if (section == null)
                return Context.Sections.Where(s => s.Parent == null)
                               .Select(s => new RequestX
                               {
                                   Section = s,
                                   Total =
                                       Context.RequestDetailGoods.Where(
                                           rdg => rdg.RequestGood.Section.FullPathID.StartsWith(
                                               SqlFunctions.StringConvert((double?)s.ID)))
                                               .Sum(r => r.Qty * r.UnitPrice)
                               });

            return Context.Sections.Where(s => s.Parent == section)
                           .Select(s => new RequestX
                               {
                                   Section = s,
                                   Total =
                                       Context.RequestDetailGoods.Where(
                                           rdg => rdg.RequestGood.Section.FullPathID.StartsWith(
                                               SqlFunctions.StringConvert((double?)s.ID)))
                                               .Sum(r => r.Qty * r.UnitPrice)
                               });
        }

        public IQueryable<RequestX> Items()
        {
            return
                BaseRequest()
                    .SelectMany(r => r.RequestDetailGoods)
                    .GroupBy(g => g.ItemGood)
                    .Select(
                        g => new RequestX
                            {
                                Item = g.Key, 
                                Qty = g.Sum(s => s.Qty), 
                                Total = g.Sum(s => s.Qty * s.UnitPrice)
                            });
        }

        public IQueryable<RequestX> SectionsItems(Section section = null)
        {
            if (section == null)
            {
                return
                    BaseRequest()
                        .SelectMany(r => r.RequestDetailGoods)
                        .Select(rd => new
                            {
                                Assistance =
                                          Context.Sections.FirstOrDefault(
                                              s =>
                                              s.Parent == null &&
                                              rd.RequestGood.Section.FullPathID.StartsWith(
                                                  SqlFunctions.StringConvert((double?) s.ID))),
                                Item = rd.ItemGood,
                                TotalQty = rd.Qty,
                                TotalPrice = rd.Qty * rd.UnitPrice
                            })
                        .GroupBy(g => new {g.Assistance, g.Item})
                        .Select(g => new RequestX
                            {
                                Section = g.Key.Assistance,
                                Item = g.Key.Item,
                                Qty = g.Sum(s => s.TotalQty),
                                Total = g.Sum(s=>s.TotalPrice)
                            });
            }
            return
                BaseRequest()
                    .SelectMany(r => r.RequestDetailGoods)
                    .Select(rd => new
                        {
                            Assistance =
                                      Context.Sections.FirstOrDefault(
                                          s =>
                                          s.Parent == section &&
                                          rd.RequestGood.Section.FullPathID.StartsWith(
                                              SqlFunctions.StringConvert((double?)s.ID))),
                            Item = rd.ItemGood,
                            TotalQty = rd.Qty,
                            TotalPrice = rd.Qty * rd.UnitPrice
                        })
                    .GroupBy(g => new { g.Assistance, g.Item })
                    .Select(g => new RequestX
                        {
                            Section = g.Key.Assistance,
                            Item = g.Key.Item,
                            Qty = g.Sum(s => s.TotalQty),
                            Total = g.Sum(s => s.TotalPrice)
                        });
        }

        public IQueryable<RequestX> SellersItems(Section section = null)
        {
            if (section == null)
            {
                return
                    BaseRequest()
                        .SelectMany(r => r.RequestDetailGoods)
                        .GroupBy(g => new { g.Seller, g.ItemGood })
                        .Select(g => new RequestX
                        {
                            Seller = g.Key.Seller,
                            Item = g.Key.ItemGood,
                            Qty = g.Sum(s => s.Qty),
                            Total = g.Sum(s => s.Qty * s.UnitPrice)
                        });
            }
            return
                BaseRequest()
                    .SelectMany(r => r.RequestDetailGoods)
                    .GroupBy(g => new {g.Seller, g.ItemGood})
                    .Select(g => new RequestX
                        {
                            Seller = g.Key.Seller,
                            Item = g.Key.ItemGood,
                            Qty = g.Sum(s => s.Qty),
                            Total = g.Sum(s => s.Qty*s.UnitPrice)
                        });
        }
    }
}
