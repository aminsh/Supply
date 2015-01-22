using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DataAccess;
using Model;

namespace BussinessLogic
{
    public class BLPurchasingOfficer : BLBase<PurchasingOfficer>
    {
        public override void OnSubmitEntity(PurchasingOfficer entity, System.Data.EntityState state, Dictionary<string, object> originalValues)
        {
            base.OnSubmitEntity(entity, state, originalValues);

            switch (state)
            {
                case EntityState.Added:
                    {
                        var emp = Context.Employees.FirstOrDefault(e => e.ID == entity.EmployeeID);
                        if (emp != null)
                            entity.Title = emp.FirstName + ' ' + emp.LastName;
                    }
                    break;
                case EntityState.Modified:
                    {
                        var lastEmp = GetOrginalValue(originalValues, ov => ov.EmployeeID).Cast<Int32>();
                        if (lastEmp != entity.EmployeeID)
                        {
                            var emp = Context.Employees.FirstOrDefault(e => e.ID == entity.EmployeeID);
                            if (emp != null)
                                entity.Title = emp.FirstName + ' ' + emp.LastName;
                        }
                    }
                    break;
                case EntityState.Deleted:
                    {
                        
                    }
                    break;
            }
        }
    }
}
