using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Model;

namespace BussinessLogic
{
    public class BLItemGood : BLBase<ItemGood>
    {
        public override void OnSubmitEntity(ItemGood entity, System.Data.EntityState state, Dictionary<string, object> originalValues)
        {
            base.OnSubmitEntity(entity, state, originalValues);

            switch (state)
            {
                case EntityState.Added:
                    {
                        var isNoDuplicated = Context.ItemGoods.Any(ig => ig.No == entity.No);
                        if (isNoDuplicated)
                            throw new ValidationExceptionX("کد کالا تکراری است",null)
                                {
                                    BadProp = "No",
                                    EntityInError = entity
                                };
                    }
                break;
                case  EntityState.Modified:
                {
                    var isNoDuplicated = Context.ItemGoods.Any(ig => ig.No == entity.No && ig.ID != entity.ID);
                    if (isNoDuplicated)
                        throw new ValidationExceptionX("کد کالا تکراری است", null)
                            {
                                BadProp = "No",
                                EntityInError = entity
                            };
                }
                break;
            }
        }
    }
}
