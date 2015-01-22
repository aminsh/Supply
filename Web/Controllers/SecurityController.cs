using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Http;
using Model;
using DataAccess;

namespace Web.Controllers
{
    public partial class SupplyController
    {
        [HttpGet]
        public IQueryable<Role> Roles()
        {
            var currentUser = _contextProvider.Context.CurrentUser();
            var adminRole = _contextProvider.Context.Roles.IncludeX(r=>r.UserInRoles).FirstOrDefault(r => r.Name == "Admin");

            if (adminRole ==null)
                throw new Exception("Please create Admin Role");
            var isUserInAdminTeam =
                adminRole
                    .UserInRoles.Any(uir => uir.UserID == currentUser.ID);

            return
                isUserInAdminTeam
                    ? _contextProvider.Context.Roles
                    : _contextProvider.Context.Roles.Where(r => r.Name != "Admin");
        }

        [HttpGet]
        public IQueryable<RolePermit> RolePermits()
        {
            return _contextProvider.Context.RolePermits;
        }

        [HttpGet]
        public IQueryable<UserPermit> UserPermits()
        {
            return _contextProvider.Context.UserPermits;
        }

        [HttpGet]
        public IQueryable<UserInRole> UserInRoles()
        {
            return _contextProvider.Context.UserInRoles;
        }

        [HttpGet]
        public IQueryable<Subject> Subjects()
        {
            return _contextProvider.Context.Subjects;
        }



        
    }
}