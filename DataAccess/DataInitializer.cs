using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Model;

namespace DataAccess
{
    public class DataInitializer : CreateDatabaseIfNotExists<AppDbContext>
    {
        protected override void Seed(AppDbContext context)
        {
            base.Seed(context);
            context.IsFirstTime = true;

            var adminRole = new Role() {Name = "Admin", Title = "تیم نرم افزار", RoleType = RoleType.System};
            var primaryUser = new User()
                {
                    Username = "frk",
                    Password = "P@ssw0rd",
                    FirstName = "فراز ",
                    LastName = "کیهان"
                };
            context.Users.Add(primaryUser);

            context.UserInRoles.Add(new UserInRole() {RoleID = adminRole.ID, UserID = primaryUser.ID});
            context.Roles.Add(adminRole);

            context.SaveChanges();

            context.Roles.Add(new Role() { Name = "Manager", Title = "مدیر سیستم", RoleType = RoleType.System });
            context.Roles.Add(new Role() {Name = "Consumer", Title = "واحد متقاضی", RoleType = RoleType.System});
            context.Roles.Add(new Role() {Name = "Supply", Title = "واحد تدارکات", RoleType = RoleType.System});
            context.Roles.Add(new Role() { Name = "SupplyManager", Title = "مدیر تدارکات", RoleType = RoleType.System });

            context.Periods.Add(new Period() {DateFrom = DateTime.Now, DateTo = DateTime.Now, IsActive = true});
            context.SaveChanges();
        }  
    }
}
