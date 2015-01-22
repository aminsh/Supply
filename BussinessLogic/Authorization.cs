using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DataAccess;
using Model;

namespace BussinessLogic
{

    public static class Authorization
    {
        public static Boolean IsUserAuthorized(Int32 userId, String subjectItem)
        {
            var subject = ConvertStringToSubject(subjectItem);

            if (IsUserInAdminRole(userId))
                return true;

            var context = new AppDbContext();
            
            if (subject.NoNeed)
                return true;
            
            var userPermit = context.UserPermits.FirstOrDefault(up => up.SubjectID == subject.ID);
            if (userPermit != null)
                return userPermit.CanRead;

            return 
                context.UserInRoles.Where(ur => ur.UserID == userId)
                       .Select(ur => ur.Role)
                       .Any(r => r.RolePermits.Any(rp => rp.CanRead && rp.SubjectID == subject.ID));
        }

        public static Boolean IsUserAuthorized(Int32 userId, String subjectItem, EntityState state)
        {
            if (IsUserInAdminRole(userId))
                return true;

            var context = new AppDbContext();

            var subject = ConvertStringToSubject(subjectItem);
            var userPermit = context.UserPermits.FirstOrDefault(up => up.SubjectID == subject.ID && up.UserID == userId);

            if (userPermit != null)
            {
                if (state == EntityState.Added || state == EntityState.Modified)
                    return userPermit.CanEdit;
                if (state == EntityState.Deleted)
                    return userPermit.CanDelete;
            }

            var rolePermits =
                context.RolePermits.Where(
                    rp =>
                    context.UserInRoles.Any(r => r.RoleID == rp.RoleID && r.UserID == userId) &&
                    rp.SubjectID == subject.ID);

            if (state == EntityState.Added || state == EntityState.Modified)
                return rolePermits.Any(rp => rp.CanEdit);
            return state == EntityState.Deleted && rolePermits.Any(rp => rp.CanDelete);
        }

        private static Boolean IsUserInAdminRole(Int32 userId)
        {
            var context = new AppDbContext();
            var adminRole = context.Roles.IncludeX(r => r.UserInRoles).FirstOrDefault(r => r.Name == "Admin");
            if(adminRole==null)
                throw new Exception("Please add a role in 'Admin' name");

            return adminRole.UserInRoles.Any(uir => uir.UserID == userId);
        }

        private static Subject ConvertStringToSubject(String subjectString)
        {
            var context = new AppDbContext();

            var subject = context.Subjects.FirstOrDefault(s => s.Name == subjectString);

            if (subject != null)
                return subject;

            var newSubject = new Subject()
                {
                    Name = subjectString,
                    Title = "---",
                    NoNeed = false
                };

            if (subjectString == "User")
                newSubject.NoNeed = true;

            context.Subjects.Add(newSubject);
            context.SaveChanges();

            return newSubject;
        }
    }
}
