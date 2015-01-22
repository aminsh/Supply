using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Helpers;
using System.Web.Http;
using DataAccess;
using Helper;
using Model;
using System.Linq.Dynamic;

namespace Web.Controllers
{
    public class Filter
    {
        public String FieldName { get; set; }
        public String EqualityOperator { get; set; }
        public String LinkOperator { get; set; }
        public Object Value { get; set; }
        public String DataType { get; set; }
    }

    public class RequestGoodX : RequestGood
    {
        public Section SectionAssistance { get; set; }
        public Int32? SectionAssistanceID { get; set; }
        public ItemGood ItemGood { get; set; }
        public Int32 ItemGoodID { get; set; }
        public Seller Seller { get; set; }
        public Int32? SellerID { get; set; }
        public Double UnitPrice { get; set; }
        public Double Qty { get; set; }
    }

    public class RequestServiceX : RequestService
    {
        public Section SectionAssistance { get; set; }
        public Int32? SectionAssistanceID { get; set; }
        public ItemService ItemService { get; set; }
        public Int32 ItemServiceID { get; set; }
        public Seller Seller { get; set; }
        public Int32? SellerID { get; set; }
        public Double? TotalPrice { get; set; }
        public DateTime? DoneDate { get; set; }
        public Boolean IsCancel { get; set; }
        public PurchaseSize PurchaseSize { get; set; }
    }

    public class RequestFoodX : RequestFood
    {
        public Section SectionAssistance { get; set; }
        public Int32? SectionAssistanceID { get; set; }
        public ItemFood ItemFood { get; set; }
        public Int32 ItemFoodID { get; set; }
        public Seller Seller { get; set; }
        public Int32? SellerID { get; set; }
        public Double? TotalPrice { get; set; }
        public DateTime? DoneDate { get; set; }
        public Boolean IsCancel { get; set; }
        public PurchaseSize PurchaseSize { get; set; }
    }

    public class RequestVehicleX : RequestVehicle
    {
        public Section SectionAssistance { get; set; }
        public Int32? SectionAssistanceID { get; set; }
        public ItemVehicle ItemVehicle { get; set; }
        public Int32 ItemVehicleID { get; set; }
        public Seller Seller { get; set; }
        public Int32? SellerID { get; set; }
        public Double? TotalPrice { get; set; }
    }
    //SectionAssistance = (int)SqlFunctions.CharIndex(".", rdg.RequestGood.Section.FullPathID) == 0
    //                                ? rdg.RequestGood.Section.FullPathID
    //                                : rdg.RequestGood.Section.FullPathID.Substring(0, (int)SqlFunctions.CharIndex(".", rdg.RequestGood.Section.FullPathID) - 1),
    public partial class SupplyController 
    {
        
        [HttpGet]
        public IQueryable<RequestGoodX> RequestGoodXs(string filter)
        {
            var filters = JsonHelper.ConvertToObject<IEnumerable<Filter>>(filter);
            var exp = filters.Any() ? string.Empty : "1==1";
            var parameters = new List<Object>();
            var i = 0;
            filters.ForEach(f =>
            {
                if (f.FieldName == null)
                    exp += " " + f.LinkOperator + " ";
                else
                {
                    exp += String.Format("{0} {1} @{2}", f.FieldName, f.EqualityOperator, i);
                    if (f.DataType == "int")
                        parameters.Add(f.Value.Convert<int>());
                    if (f.DataType == "double")
                        parameters.Add(f.Value.Convert<double>());
                    if (f.DataType == "DateTime")
                        parameters.Add(DateTimeHelper.PersianToDateTime(f.Value.ToString()));
                    i += 1;
                }

            });

            var context = new AppDbContext();
            return
                context.RequestDetailGoods
                       .IncludeX(rdg => rdg.RequestGood)
                       .IncludeX(rdg => rdg.ItemGood.Scale)
                       .Select(rdg => new RequestGoodX()
                           {
                               Section = rdg.RequestGood.Section,
                               SectionID = rdg.RequestGood.SectionID,
                               SectionAssistance = rdg.RequestGood.Section.Parent ?? rdg.RequestGood.Section,
                               SectionAssistanceID =
                                   rdg.RequestGood.Section.Parent == null
                                       ? rdg.RequestGood.SectionID
                                       : rdg.RequestGood.Section.Parent.ID,
                               Person = rdg.RequestGood.Person,
                               PersonID = rdg.RequestGood.PersonID,
                               PurchasingOfficer = rdg.RequestGood.PurchasingOfficer,
                               PurchasingOfficerID = rdg.RequestGood.PurchasingOfficerID,
                               Date = rdg.RequestGood.Date,
                               ID = rdg.RequestGoodID,
                               ItemGood = rdg.ItemGood,
                               ItemGoodID = rdg.ItemGoodID,
                               Seller = rdg.Seller,
                               SellerID = rdg.SellerID,
                               UnitPrice = rdg.UnitPrice,
                               Qty = rdg.Qty
                           }).Where(exp, parameters.ToArray());
        }
        [HttpGet]
        public IQueryable RequestGoodGrouping(string group , string defaultFilter)
        {
            var filters = JsonHelper.JsonToObject<Filter>(defaultFilter).ToList();
            
            var exp = filters.Any() ? string.Empty : "1==1";
            var parameters = new List<Object>();
            var i = 0;
            filters.ForEach(f =>
                {
                    if (f.FieldName == null)
                        exp += " " + f.LinkOperator + " ";
                    else
                    {
                        exp += String.Format("{0} {1} @{2}", f.FieldName, f.EqualityOperator, i);
                        if (f.DataType == "int")
                            parameters.Add(f.Value.Convert<int>());
                        if(f.DataType == "double")
                            parameters.Add(f.Value.Convert<double>());
                        if(f.DataType=="DateTime")
                            parameters.Add(DateTimeHelper.PersianToDateTime(f.Value.ToString()));
                        i += 1;
                    }  
                   
                });
            var context = new AppDbContext();
            var groupExp = string.Empty;
            var selectExp = "Sum(UnitPrice * Qty) as TotalPrice";

            if (group.Contains("ItemGood"))
                selectExp += ",Sum(Qty) as SumQty";
            
            var groupList = group.Split(';');
            groupList.ForEach(item =>
                {
                    groupExp += groupExp == string.Empty
                                    ? string.Format("it.{0}", item)
                                    : string.Format(",it.{0}", item);
                    selectExp += selectExp == string.Empty
                                     ? string.Format("key.{0} as {0}", item)
                                     : string.Format(",key.{0} as {0}", item);
                });

            groupExp = string.Format("new({0})", groupExp);
            selectExp = string.Format("new({0})",selectExp);

            if (defaultFilter != string.Empty)
            {
                return
                    context.RequestDetailGoods.IncludeX(rdg=> rdg.RequestGood).Select(rdg=> new RequestGoodX()
                        {
                            Section = rdg.RequestGood.Section, 
                            SectionID = rdg.RequestGood.SectionID,
                            SectionAssistance = rdg.RequestGood.Section.Parent ?? rdg.RequestGood.Section,
                            SectionAssistanceID = rdg.RequestGood.Section.Parent == null ? rdg.RequestGood.SectionID : rdg.RequestGood.Section.Parent.ID,
                            Person = rdg.RequestGood.Person,
                            PersonID = rdg.RequestGood.PersonID,
                            PurchasingOfficer = rdg.RequestGood.PurchasingOfficer,
                            PurchasingOfficerID = rdg.RequestGood.PurchasingOfficerID,
                            Date = rdg.RequestGood.Date,
                            ID = rdg.RequestGoodID,
                            ItemGood = rdg.ItemGood,
                            ItemGoodID = rdg.ItemGoodID,
                            Seller = rdg.Seller,
                            SellerID = rdg.SellerID,
                            UnitPrice = rdg.UnitPrice,
                            Qty = rdg.Qty
                        }).Where(exp,parameters.ToArray())
                    //.Where(rdg => rdg.Section.FullPathID.Contains("[103]"))
                    .GroupBy(groupExp, "it")
                           .Select(selectExp)
                           .AsQueryable();
            }
            return
                context.RequestDetailGoods.GroupBy(groupExp, "it")
                       .Select(selectExp)
                       .AsQueryable();
        }

        [HttpGet]
        public IQueryable<RequestServiceX> RequestServiceXs(string filter)
        {
            var filters = filter.JsonToObject<Filter>().ToList();
            var exp = filters.Any() ? string.Empty : "1==1";
            var parameters = new List<Object>();
            var i = 0;
            filters.ForEach(f =>
            {
                if (f.FieldName == null)
                    exp += " " + f.LinkOperator + " ";
                else
                {
                    exp += String.Format("{0} {1} @{2}", f.FieldName, f.EqualityOperator, i);
                    if (f.DataType == "int")
                        parameters.Add(f.Value.Convert<int>());
                    if (f.DataType == "double")
                        parameters.Add(f.Value.Convert<double>());
                    if (f.DataType == "DateTime")
                        parameters.Add(DateTimeHelper.PersianToDateTime(f.Value.ToString()));
                    i += 1;
                }

            });

            var context = new AppDbContext();
            return
                context.RequestDetailServices
                       .IncludeX(rdg => rdg.RequestService)
                       .IncludeX(rdg => rdg.ItemService.Scale)
                       .Select(rdg => new RequestServiceX()
                       {
                           IsCancel = rdg.IsCancel,
                           DoneDate = rdg.DoneDate,
                           PurchaseSize = rdg.PurchaseSize,
                           Section = rdg.RequestService.Section,
                           SectionID = rdg.RequestService.SectionID,
                           SectionAssistance = rdg.RequestService.Section.Parent ?? rdg.RequestService.Section,
                           SectionAssistanceID =
                               rdg.RequestService.Section.Parent == null
                                   ? rdg.RequestService.SectionID
                                   : rdg.RequestService.Section.Parent.ID,
                           Person = rdg.RequestService.Person,
                           PersonID = rdg.RequestService.PersonID,
                           PurchasingOfficer = rdg.RequestService.PurchasingOfficer,
                           PurchasingOfficerID = rdg.RequestService.PurchasingOfficerID,
                           Date = rdg.RequestService.Date,
                           ID = rdg.RequestServiceID,
                           ItemService = rdg.ItemService,
                           ItemServiceID = rdg.ItemServiceID,
                           Seller = rdg.Seller,
                           SellerID = rdg.SellerID,
                           TotalPrice = rdg.TotalPrice
                       }).Where(exp, parameters.ToArray());
        }
        [HttpGet]
        public IQueryable RequestServiceGrouping(string group, string defaultFilter)
        {
            var filters = JsonHelper.ConvertToObject<IEnumerable<Filter>>(defaultFilter);

            var exp = filters.Any() ? string.Empty : "1==1";
            var parameters = new List<Object>();
            var i = 0;
            filters.ForEach(f =>
            {
                if (f.FieldName == null)
                    exp += " " + f.LinkOperator + " ";
                else
                {
                    exp += String.Format("{0} {1} @{2}", f.FieldName, f.EqualityOperator, i);
                    if (f.DataType == "int")
                        parameters.Add(f.Value.Convert<int>());
                    if (f.DataType == "double")
                        parameters.Add(f.Value.Convert<double>());
                    if (f.DataType == "DateTime")
                        parameters.Add(DateTimeHelper.PersianToDateTime(f.Value.ToString()));
                    i += 1;
                }

            });
            var context = new AppDbContext();
            var groupExp = string.Empty;
            var selectExp = "Sum(TotalPrice) as TotalPrice";

            //if (group.Contains("ItemService"))
            //    selectExp += ",Sum(Qty) as SumQty";

            var groupList = group.Split(';');
            groupList.ForEach(item =>
            {
                groupExp += groupExp == string.Empty
                                ? string.Format("it.{0}", item)
                                : string.Format(",it.{0}", item);
                selectExp += selectExp == string.Empty
                                 ? string.Format("key.{0} as {0}", item)
                                 : string.Format(",key.{0} as {0}", item);
            });

            groupExp = string.Format("new({0})", groupExp);
            selectExp = string.Format("new({0})", selectExp);

            if (defaultFilter != string.Empty)
            {
                return
                    context.RequestDetailServices.IncludeX(rdg => rdg.RequestService).Select(rdg => new RequestServiceX()
                    {
                        Section = rdg.RequestService.Section,
                        SectionID = rdg.RequestService.SectionID,
                        SectionAssistance = rdg.RequestService.Section.Parent ?? rdg.RequestService.Section,
                        SectionAssistanceID = rdg.RequestService.Section.Parent == null ? rdg.RequestService.SectionID : rdg.RequestService.Section.Parent.ID,
                        Person = rdg.RequestService.Person,
                        PersonID = rdg.RequestService.PersonID,
                        PurchasingOfficer = rdg.RequestService.PurchasingOfficer,
                        PurchasingOfficerID = rdg.RequestService.PurchasingOfficerID,
                        Date = rdg.RequestService.Date,
                        ID = rdg.RequestServiceID,
                        ItemService = rdg.ItemService,
                        ItemServiceID = rdg.ItemServiceID,
                        Seller = rdg.Seller,
                        SellerID = rdg.SellerID,
                        TotalPrice = rdg.TotalPrice
                    }).Where(exp, parameters.ToArray())
                    //.Where(rdg => rdg.Section.FullPathID.Contains("[103]"))
                    .GroupBy(groupExp, "it")
                           .Select(selectExp)
                           .AsQueryable();
            }
            return
                context.RequestDetailServices.GroupBy(groupExp, "it")
                       .Select(selectExp)
                       .AsQueryable();
        }

        [HttpGet]
        public IQueryable<RequestFoodX> RequestFoodXs(string filter)
        {
            var filters = filter.JsonToObject<Filter>().ToList();
            var exp = filters.Any() ? string.Empty : "1==1";
            var parameters = new List<Object>();
            var i = 0;
            filters.ForEach(f =>
            {
                if (f.FieldName == null)
                    exp += " " + f.LinkOperator + " ";
                else
                {
                    exp += String.Format("{0} {1} @{2}", f.FieldName, f.EqualityOperator, i);
                    if (f.DataType == "int")
                        parameters.Add(f.Value.Convert<int>());
                    if (f.DataType == "double")
                        parameters.Add(f.Value.Convert<double>());
                    if (f.DataType == "DateTime")
                        parameters.Add(DateTimeHelper.PersianToDateTime(f.Value.ToString()));
                    i += 1;
                }

            });

            var context = new AppDbContext();
            return
                context.RequestDetailFoods
                       .IncludeX(rdg => rdg.RequestFood)
                       .IncludeX(rdg => rdg.ItemFood.Scale)
                       .Select(rdg => new RequestFoodX()
                       {
                           IsCancel = rdg.IsCancel,
                           DoneDate = rdg.DoneDate,
                           PurchaseSize = rdg.PurchaseSize,
                           Section = rdg.RequestFood.Section,
                           SectionID = rdg.RequestFood.SectionID,
                           SectionAssistance = rdg.RequestFood.Section.Parent ?? rdg.RequestFood.Section,
                           SectionAssistanceID =
                               rdg.RequestFood.Section.Parent == null
                                   ? rdg.RequestFood.SectionID
                                   : rdg.RequestFood.Section.Parent.ID,
                           Person = rdg.RequestFood.Person,
                           PersonID = rdg.RequestFood.PersonID,
                           PurchasingOfficer = rdg.RequestFood.PurchasingOfficer,
                           PurchasingOfficerID = rdg.RequestFood.PurchasingOfficerID,
                           Date = rdg.RequestFood.Date,
                           ID = rdg.RequestFoodID,
                           ItemFood = rdg.ItemFood,
                           ItemFoodID = rdg.ItemFoodID,
                           Seller = rdg.Seller,
                           SellerID = rdg.SellerID,
                           TotalPrice = rdg.TotalPrice
                       }).Where(exp, parameters.ToArray());
        }
        [HttpGet]
        public IQueryable RequestFoodGrouping(string group, string defaultFilter)
        {
            var filters = JsonHelper.ConvertToObject<IEnumerable<Filter>>(defaultFilter);

            var exp = filters.Any() ? string.Empty : "1==1";
            var parameters = new List<Object>();
            var i = 0;
            filters.ForEach(f =>
            {
                if (f.FieldName == null)
                    exp += " " + f.LinkOperator + " ";
                else
                {
                    exp += String.Format("{0} {1} @{2}", f.FieldName, f.EqualityOperator, i);
                    if (f.DataType == "int")
                        parameters.Add(f.Value.Convert<int>());
                    if (f.DataType == "double")
                        parameters.Add(f.Value.Convert<double>());
                    if (f.DataType == "DateTime")
                        parameters.Add(DateTimeHelper.PersianToDateTime(f.Value.ToString()));
                    i += 1;
                }

            });
            var context = new AppDbContext();
            var groupExp = string.Empty;
            var selectExp = "Sum(TotalPrice) as TotalPrice";

            //if (group.Contains("ItemFood"))
            //    selectExp += ",Sum(Qty) as SumQty";

            var groupList = group.Split(';');
            groupList.ForEach(item =>
            {
                groupExp += groupExp == string.Empty
                                ? string.Format("it.{0}", item)
                                : string.Format(",it.{0}", item);
                selectExp += selectExp == string.Empty
                                 ? string.Format("key.{0} as {0}", item)
                                 : string.Format(",key.{0} as {0}", item);
            });

            groupExp = string.Format("new({0})", groupExp);
            selectExp = string.Format("new({0})", selectExp);

            if (defaultFilter != string.Empty)
            {
                return
                    context.RequestDetailFoods.IncludeX(rdg => rdg.RequestFood).Select(rdg => new RequestFoodX()
                    {
                        Section = rdg.RequestFood.Section,
                        SectionID = rdg.RequestFood.SectionID,
                        SectionAssistance = rdg.RequestFood.Section.Parent ?? rdg.RequestFood.Section,
                        SectionAssistanceID = rdg.RequestFood.Section.Parent == null ? rdg.RequestFood.SectionID : rdg.RequestFood.Section.Parent.ID,
                        Person = rdg.RequestFood.Person,
                        PersonID = rdg.RequestFood.PersonID,
                        PurchasingOfficer = rdg.RequestFood.PurchasingOfficer,
                        PurchasingOfficerID = rdg.RequestFood.PurchasingOfficerID,
                        Date = rdg.RequestFood.Date,
                        ID = rdg.RequestFoodID,
                        ItemFood = rdg.ItemFood,
                        ItemFoodID = rdg.ItemFoodID,
                        Seller = rdg.Seller,
                        SellerID = rdg.SellerID,
                        TotalPrice = rdg.TotalPrice
                    }).Where(exp, parameters.ToArray())
                    //.Where(rdg => rdg.Section.FullPathID.Contains("[103]"))
                    .GroupBy(groupExp, "it")
                           .Select(selectExp)
                           .AsQueryable();
            }
            return
                context.RequestDetailFoods.GroupBy(groupExp, "it")
                       .Select(selectExp)
                       .AsQueryable();
        }

        [HttpGet]
        public IQueryable<RequestVehicleX> RequestVehicleXs(string filter)
        {
            var filters = JsonHelper.JsonToObject<Filter>(filter).ToList();
            var exp = filters.Any() ? string.Empty : "1==1";
            var parameters = new List<Object>();
            var i = 0;
            filters.ForEach(f =>
            {
                if (f.FieldName == null)
                    exp += " " + f.LinkOperator + " ";
                else
                {
                    exp += String.Format("{0} {1} @{2}", f.FieldName, f.EqualityOperator, i);
                    if (f.DataType == "int")
                        parameters.Add(f.Value.Convert<int>());
                    if (f.DataType == "double")
                        parameters.Add(f.Value.Convert<double>());
                    if (f.DataType == "DateTime")
                        parameters.Add(DateTimeHelper.PersianToDateTime(f.Value.ToString()));
                    i += 1;
                }

            });

            var context = new AppDbContext();
            return
                context.RequestDetailVehicles
                       .IncludeX(rdg => rdg.RequestVehicle)
                       .IncludeX(rdg => rdg.ItemVehicle.Scale)
                       .Select(rdg => new RequestVehicleX()
                       {
                           Section = rdg.RequestVehicle.Section,
                           SectionID = rdg.RequestVehicle.SectionID,
                           SectionAssistance = rdg.RequestVehicle.Section.Parent ?? rdg.RequestVehicle.Section,
                           SectionAssistanceID =
                               rdg.RequestVehicle.Section.Parent == null
                                   ? rdg.RequestVehicle.SectionID
                                   : rdg.RequestVehicle.Section.Parent.ID,
                           Person = rdg.RequestVehicle.Person,
                           PersonID = rdg.RequestVehicle.PersonID,
                           PurchasingOfficer = rdg.RequestVehicle.PurchasingOfficer,
                           PurchasingOfficerID = rdg.RequestVehicle.PurchasingOfficerID,
                           Date = rdg.RequestVehicle.Date,
                           ID = rdg.RequestVehicleID,
                           ItemVehicle = rdg.ItemVehicle,
                           ItemVehicleID = rdg.ItemVehicleID,
                           Seller = rdg.Seller,
                           SellerID = rdg.SellerID,
                           TotalPrice = rdg.TotalPrice
                       }).Where(exp, parameters.ToArray());
        }
        [HttpGet]
        public IQueryable RequestVehicleGrouping(string group, string defaultFilter)
        {
            var filters = JsonHelper.ConvertToObject<IEnumerable<Filter>>(defaultFilter);

            var exp = filters.Any() ? string.Empty : "1==1";
            var parameters = new List<Object>();
            var i = 0;
            filters.ForEach(f =>
            {
                if (f.FieldName == null)
                    exp += " " + f.LinkOperator + " ";
                else
                {
                    exp += String.Format("{0} {1} @{2}", f.FieldName, f.EqualityOperator, i);
                    if (f.DataType == "int")
                        parameters.Add(f.Value.Convert<int>());
                    if (f.DataType == "double")
                        parameters.Add(f.Value.Convert<double>());
                    if (f.DataType == "DateTime")
                        parameters.Add(DateTimeHelper.PersianToDateTime(f.Value.ToString()));
                    i += 1;
                }

            });
            var context = new AppDbContext();
            var groupExp = string.Empty;
            var selectExp = "Sum(TotalPrice) as TotalPrice";

            //if (group.Contains("ItemVehicle"))
            //    selectExp += ",Sum(Qty) as SumQty";

            var groupList = group.Split(';');
            groupList.ForEach(item =>
            {
                groupExp += groupExp == string.Empty
                                ? string.Format("it.{0}", item)
                                : string.Format(",it.{0}", item);
                selectExp += selectExp == string.Empty
                                 ? string.Format("key.{0} as {0}", item)
                                 : string.Format(",key.{0} as {0}", item);
            });

            groupExp = string.Format("new({0})", groupExp);
            selectExp = string.Format("new({0})", selectExp);

            if (defaultFilter != string.Empty)
            {
                return
                    context.RequestDetailVehicles.IncludeX(rdg => rdg.RequestVehicle).Select(rdg => new RequestVehicleX()
                    {
                        Section = rdg.RequestVehicle.Section,
                        SectionID = rdg.RequestVehicle.SectionID,
                        SectionAssistance = rdg.RequestVehicle.Section.Parent ?? rdg.RequestVehicle.Section,
                        SectionAssistanceID = rdg.RequestVehicle.Section.Parent == null ? rdg.RequestVehicle.SectionID : rdg.RequestVehicle.Section.Parent.ID,
                        Person = rdg.RequestVehicle.Person,
                        PersonID = rdg.RequestVehicle.PersonID,
                        PurchasingOfficer = rdg.RequestVehicle.PurchasingOfficer,
                        PurchasingOfficerID = rdg.RequestVehicle.PurchasingOfficerID,
                        Date = rdg.RequestVehicle.Date,
                        ID = rdg.RequestVehicleID,
                        ItemVehicle = rdg.ItemVehicle,
                        ItemVehicleID = rdg.ItemVehicleID,
                        Seller = rdg.Seller,
                        SellerID = rdg.SellerID,
                        TotalPrice = rdg.TotalPrice
                    }).Where(exp, parameters.ToArray())
                    //.Where(rdg => rdg.Section.FullPathID.Contains("[103]"))
                    .GroupBy(groupExp, "it")
                           .Select(selectExp)
                           .AsQueryable();
            }
            return
                context.RequestDetailVehicles.GroupBy(groupExp, "it")
                       .Select(selectExp)
                       .AsQueryable();
        }
    }
}
