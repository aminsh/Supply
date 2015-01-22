using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using DataAccess;
using Helper.MyHelper;
using Model;

namespace Web.Controllers
{
    [AuthorizeX]
    public partial class SupplyController : BreezeBaseController
    {

        [HttpGet]
        public IQueryable<User> Users()
        {
            return _contextProvider.Context.Users;
        }

        [HttpGet]
        public IQueryable<DefaultSetting> DefaultSettings()
        {
            using (var context = new AppDbContext())
            {
                if (!context.DefaultSettings.Any())
                {
                    var defaulSetting = new DefaultSetting()
                        {
                            GovermentSystemAmount = 0,
                            TaxPercent = 0,
                            VATPercent = 0
                        };
                    context.DefaultSettings.Add(defaulSetting);
                    context.SaveChanges();
                }
            }

            return _contextProvider.Context.DefaultSettings;
        }


        [HttpGet]
        public IQueryable<Period> Periods()
        {
            return _contextProvider.Context.Periods;
        }

        [HttpGet]
        [AllowAnonymous]
        public IQueryable<Person> People()
        {
            return _contextProvider.Context.People;
        }

        [HttpGet]
        [AllowAnonymous]
        public IQueryable<Employee> Employees()
        {
            return _contextProvider.Context.Employees;
        }

        [HttpGet]
        public IQueryable<Everyone> Everyones()
        {
            return _contextProvider.Context.Everyones;
        }

        [HttpGet]
        public IQueryable<Stock> Stocks()
        {
            return _contextProvider.Context.Stocks;
        }

        [HttpGet]
        [AllowAnonymous]
        public IQueryable<Section> Sections()
        {
            return _contextProvider.Context.Sections;
        }

        [HttpGet]
        [AllowAnonymous]
        public IQueryable<Scale> Scales()
        {
            return _contextProvider.Context.Scales;
        }
        
        [HttpGet]
        [AllowAnonymous]
        public IQueryable<ItemGood> ItemGoods()
        {
            return _contextProvider.Context.ItemGoods;
        }
        
        [HttpGet]
        public IQueryable<ItemService> ItemServices()
        {
            return _contextProvider.Context.ItemServices;
        }

        [HttpGet]
        public IQueryable<ItemFood> ItemFoods()
        {
            return _contextProvider.Context.ItemFoods;
        }

        [HttpGet]
        public IQueryable<ItemVehicle> ItemVehicles()
        {
            return _contextProvider.Context.ItemVehicles;
        }

        [HttpGet]
        public IQueryable<Vehicle> Vehicles()
        {
            return _contextProvider.Context.Vehicles;
        }

        [HttpGet]
        public IQueryable<VehicleType> VehicleTypes()
        {
            return _contextProvider.Context.VehicleTypes;
        }
        
        [HttpGet]
        public IQueryable<Driver> Drivers()
        {
            return _contextProvider.Context.Drivers;
        }

        [HttpGet]
        public IQueryable<PurchasingOfficer> PurchasingOfficers()
        {
            return _contextProvider.Context.PurchasingOfficers;
        }

        [HttpGet]
        public IQueryable<Seller> Sellers()
        {
            return _contextProvider.Context.Sellers;
        }

        [HttpGet]
        public IQueryable<RequestGood> RequestGoods()
        {
            return _contextProvider.Context.RequestGoods;
        }


        [HttpGet]
        public IQueryable<RequestDetailGood> RequestDetailGoods()
        {
            return _contextProvider.Context.RequestDetailGoods;
        }

        [HttpGet]
        public IQueryable<CostType> CostTypes()
        {
            return _contextProvider.Context.CostTypes;
        }


        [HttpGet]
        public IQueryable<EffectiveCostGood> EffectiveCostGoods()
        {
            return _contextProvider.Context.EffectiveCostGoods;
        }


        [HttpGet]
        public IQueryable<EffectiveCostService> EffectiveCostServices()
        {
            return _contextProvider.Context.EffectiveCostServices;
        }

        [HttpGet]
        public IQueryable<RequestFood> RequestFoods()
        {
            return _contextProvider.Context.RequestFoods;
        }


        [HttpGet]
        public IQueryable<RequestDetailFood> RequestDetailFoods()
        {
            return _contextProvider.Context.RequestDetailFoods;
        }

        [HttpGet]
        public IQueryable<EffectiveCostFood> EffectiveCostFoods()
        {
            return _contextProvider.Context.EffectiveCostFoods;
        }


        [HttpGet]
        public IQueryable<EffectiveCostVehicle> EffectiveCostVehicles()
        {
            return _contextProvider.Context.EffectiveCostVehicles;
        }

        [HttpGet]
        public IQueryable<RequestService> RequestServices()
        {
            return _contextProvider.Context.RequestServices;
        }

        [HttpGet]
        public IQueryable<RequestDetailService> RequestDetailServices()
        {
            return _contextProvider.Context.RequestDetailServices;
        }

        [HttpGet]
        public IQueryable<RequestVehicle> RequestVehicles()
        {
            return _contextProvider.Context.RequestVehicles;
        }

        [HttpGet]
        public IQueryable<RequestDetailVehicle> RequestDetailVehicles()
        {
            return _contextProvider.Context.RequestDetailVehicles;
        }

        [HttpGet]
        public IQueryable<RequestTicket> RequestTickets()
        {
            return _contextProvider.Context.RequestTickets;
        }

        [HttpGet]
        public IQueryable<RequestDetailTicket> RequestDetailTickets()
        {
            return _contextProvider.Context.RequestDetailTickets;
        }

        [HttpGet]
        public IQueryable<SmallCostServiceDetail> SmallCostServiceDetails()
        {
            return _contextProvider.Context.SmallCostServiceDetails;
        }

        [HttpGet]
        public IQueryable<SmallCostVehicleDetail> SmallCostVehicleDetails()
        {
            return _contextProvider.Context.SmallCostVehicleDetails;
        }

        [HttpGet]
        public IQueryable<UserDefinedCategory> UserDefinedCategories()
        {
            return _contextProvider.Context.UserDefinedCategories;
        }


        [HttpGet]
        public IQueryable<Input> Inputs()
        {
            return _contextProvider.Context.Inputs;
        }


        [HttpGet]
        public IQueryable<InputDetail> InputDetails()
        {
            return _contextProvider.Context.InputDetails;
        }


        [HttpGet]
        public IQueryable<Output> Outputs()
        {
            return _contextProvider.Context.Outputs;
        }


        [HttpGet]
        public IQueryable<OutputDetail> OutputDetails()
        {
            return _contextProvider.Context.OutputDetails;
        }

        [HttpGet]
        public IQueryable<Letter> Letters()
        {
            return _contextProvider.Context.Letters;
        } 
    }
}
