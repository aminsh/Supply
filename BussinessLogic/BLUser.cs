using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web.Security;
using Model;

namespace BussinessLogic
{
    public class BLUser : BLBase<User>
    {
        public override void OnSubmitEntity(User entity, EntityState state, Dictionary<string, object> originalValues)
        {
            switch (state)
            {
                case EntityState.Added:
                    {
                        var isEmailDuplicated = Context.Users.Any(u => u.Username == entity.Username);
                        if (isEmailDuplicated)
                        {
                            var msg = "کاربر با نام کاربری وارده شده ، قبلا در سیستم ثبت نام کرده است";
                          
                            throw new ValidationExceptionX(msg, null)
                            {
                                BadProp = "UserName",
                                EntityInError = entity
                            };
                        }

                        var encryptedPass = FormsAuthentication.HashPasswordForStoringInConfigFile(entity.Password, "MD5");
                        entity.Password = encryptedPass;
                    }
                    break;

                    case EntityState.Modified:
                    {
                        if (entity.Password == "none")
                            entity.Password = GetOrginalValue(originalValues, ov => ov.Password).ToString();

                        if (entity.Password != GetOrginalValue(originalValues, ov => ov.Password).ToString())
                        {
                            var encryptedPass = FormsAuthentication.HashPasswordForStoringInConfigFile(entity.Password, "MD5");
                            entity.Password = encryptedPass;
                        }
                    }
                    break;

                    case EntityState.Deleted:
                    {
                        
                    }
                    break;
            }
            base.OnSubmitEntity(entity, state, originalValues);
        }
    }
}
