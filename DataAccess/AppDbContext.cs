using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Common;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Data.Entity.Migrations;
using System.Data.Entity.ModelConfiguration.Conventions;
using System.Data.Entity.Validation;
using System.Data.Objects;
using System.Linq;
using System.Reflection;
using System.Security.Authentication;
using System.Text;
using System.Threading.Tasks;
using Model;

namespace DataAccess
{
    public partial class AppDbContext : DbContext
    {
        static AppDbContext()
        {
            Database.SetInitializer(new IndexInitializer<AppDbContext>());
            Database.SetInitializer(new MigrateDatabaseToLatestVersion<AppDbContext, MigrationManager<AppDbContext>>());
            //Database.SetInitializer(new DataInitializer());
          
            try
            {
                _LogicAssembly = Assembly.Load(new AssemblyName("BussinessLogic"));
            }
            catch
            {
                throw new InvalidOperationException("Please Add Reference BussinessLogic to App Server");
            }
        }

        private static readonly Assembly _LogicAssembly;

        public AppDbContext()
            : base("dbConnectionString")
        {

        }
        
        protected override DbEntityValidationResult ValidateEntity(DbEntityEntry entityEntry,
                                                                   IDictionary<Object, Object> items)
        {
            var efValidationResult = base.ValidateEntity(entityEntry, items);
            
            
            if (!efValidationResult.IsValid)
            {
                string errorMassage = string.Empty;
                efValidationResult.ValidationErrors.ForEach(e =>
                                                                {
                                                                    errorMassage += e.ErrorMessage;
                                                                });
                throw new InvalidOperationException(errorMassage);
            }

            var entity = entityEntry.Entity;
            
            Type entityTypeName;

            if(entity.GetType().Namespace.Contains("DynamicProxies"))
                entityTypeName = entity.GetType().BaseType;
            else
                entityTypeName = entity.GetType();


            var logicType = _LogicAssembly.GetType(String.Format("BussinessLogic.BL{0}", entityTypeName.Name));

            var originalValues = new Dictionary<String, Object>();

            if (entityEntry.State.IsIn(EntityState.Modified, EntityState.Deleted))
            {
                var efOriginalValues = entityEntry.OriginalValues;

                foreach (var orgnPropName in efOriginalValues.PropertyNames)
                {
                    originalValues.Add(orgnPropName, efOriginalValues[orgnPropName]);
                }
            }

            if (logicType != null)
            {
                var logicInstance = Activator.CreateInstance(logicType);

                logicType.GetProperty("Context").SetValue(logicInstance, this);
                
                //logicType.GetMethod("OnSubmitEntity").Invoke(logicInstance, new Object[] { entity, entityEntry.State, originalValues });
            }

            return efValidationResult;
        }

        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            //modelBuilder.Entity<Scale>().ToTable("Scales","Stock");
            //modelBuilder.Entity<Person>()
            //   .HasRequired(x => x.Employment)
            //   .WithRequiredPrincipal();

            //modelBuilder.Entity<Person>().WillCascadeOnDelete(false);

            //modelBuilder.Entity<RequestDefineStep>().HasMany(rds => rds.HandlerUsers).WithMany();
            
            modelBuilder.Conventions.Remove<OneToManyCascadeDeleteConvention>();
            //modelBuilder.Entity<RequestDetailService>().HasRequired(r=>r.RequestService).WithMany(r=>r.RequestDetailServices).WillCascadeOnDelete();

            base.OnModelCreating(modelBuilder);
        }

        public Boolean IsFirstTime { get; set; }

        public DbSet<User> Users { get; set; }
        public DbSet<DefaultSetting> DefaultSettings { get; set; }
        public DbSet<Period> Periods { get; set; }

        public DbSet<Person> People { get; set; }
        public DbSet<Employee> Employees { get; set; }
        public DbSet<Everyone> Everyones { get; set; }

        public DbSet<PurchasingOfficer> PurchasingOfficers { get; set; }

        public DbSet<ItemGood> ItemGoods { get; set; }
        public DbSet<ItemService> ItemServices { get; set; }
        public DbSet<ItemFood> ItemFoods { get; set; }
        public DbSet<ItemVehicle> ItemVehicles { get; set; }
        public DbSet<ItemTicket> ItemTickets { get; set; }

        public DbSet<Seller> Sellers { get; set; }

        public DbSet<Section> Sections { get; set; }
        public DbSet<SectionConfirm> SectionConfirms { get; set; }

        public DbSet<CostType> CostTypes { get; set; }
        public DbSet<Vehicle> Vehicles { get; set; }
        public DbSet<VehicleType> VehicleTypes { get; set; }
        public DbSet<Driver> Drivers { get; set; }
        public DbSet<Scale> Scales { get; set; }

        public DbSet<Request> Requests { get; set; }
        public DbSet<RequestDetail> RequestDetails { get; set; }

        public DbSet<RequestSubmitBatch> RequestSubmitBatches { get; set; }
        public DbSet<RequestDetailInBatch> RequestDetailInBatches { get; set; }

        public DbSet<RequestGood> RequestGoods { get; set; }
        public DbSet<RequestDetailGood> RequestDetailGoods { get; set; }

        public DbSet<RequestService> RequestServices { get; set; }
        public DbSet<RequestDetailService> RequestDetailServices { get; set; }

        public DbSet<RequestFood> RequestFoods { get; set; }
        public DbSet<RequestDetailFood> RequestDetailFoods { get; set; }

        public DbSet<RequestVehicle> RequestVehicles { get; set; }
        public DbSet<RequestDetailVehicle> RequestDetailVehicles { get; set; }

        public DbSet<RequestTicket> RequestTickets { get; set; }
        public DbSet<RequestDetailTicket> RequestDetailTickets { get; set; }

        public DbSet<EffectiveCost> EffectiveCosts { get; set; } 
        public DbSet<EffectiveCostGood> EffectiveCostGoods { get; set; }
        public DbSet<EffectiveCostService> EffectiveCostServices { get; set; }
        public DbSet<EffectiveCostFood> EffectiveCostFoods { get; set; }
        
        public DbSet<EffectiveCostVehicle> EffectiveCostVehicles { get; set; }
        public DbSet<EffectiveCostTicket> EffectiveCostTickets { get; set; }
        public DbSet<EffectiveCostGoodDetail> EffectiveCostGoodDetails { get; set; }
        public DbSet<EffectiveCostServiceDetail> EffectiveCostServiceDetails { get; set; }
        public DbSet<EffectiveCostFoodDetail> EffectiveCostFoodDetails { get; set; }
        public DbSet<EffectiveCostTicketDetail> EffectiveCostTicketDetails { get; set; }
        public DbSet<EffectiveCostVehicleDetail> EffectiveCostVehicleDetails { get; set; }

        public DbSet<SmallCost> SmallCosts { get; set; }
        public DbSet<SmallCostServiceDetail> SmallCostServiceDetails { get; set; }
        public DbSet<SmallCostVehicleDetail> SmallCostVehicleDetails { get; set; }

        public DbSet<Letter> Letters { get; set; }
        public DbSet<LetterRequestService> LetterRequestServices { get; set; }
        public DbSet<LetterRequestVehicle> LetterRequestVehicles { get; set; }
        public DbSet<LetterRequestTicket> LetterRequestTickets { get; set; }

        public DbSet<UserDefinedCategory> UserDefinedCategories { get; set; }

        public DbSet<Role> Roles { get; set; }
        public DbSet<UserInRole> UserInRoles { get; set; }
        public DbSet<Subject> Subjects { get; set; }
        public DbSet<UserPermit> UserPermits { get; set; }
        public DbSet<RolePermit> RolePermits { get; set; }

        public DbSet<Stock> Stocks { get; set; }
        public DbSet<ItemGoodInStock> ItemGoodInStocks { get; set; }

        public DbSet<Inventory> Inventories { get; set; }
        public DbSet<InventoryDetail> InventoryDetails { get; set; }

        public DbSet<Input> Inputs { get; set; }
        public DbSet<InputDetail> InputDetails { get; set; }

        public DbSet<Output> Outputs { get; set; }
        public DbSet<OutputDetail> OutputDetails { get; set; }

        public DbSet<RequestStep> RequestSteps { get; set; }
        public DbSet<RequestDefineStep> RequestDefineSteps { get; set; }
        public DbSet<RequestDefineStepUser> RequestDefineStepUsers { get; set; }
        public DbSet<RequestTypeInRequestDefineStep> RequestTypeInRequestDefineSteps { get; set; }
    }

    public class MigrationManager<TDbContext> : DbMigrationsConfiguration<TDbContext>
    where TDbContext : DbContext
    {
        public MigrationManager()
        {
            AutomaticMigrationsEnabled = true;
            AutomaticMigrationDataLossAllowed = true;
        }
    }
}
